import { create } from 'zustand'

interface TelemetryEvent {
  event_type: string
  timestamp: string
  page_path?: string
  feature_id?: string
  feature_name?: string
  action_type?: string
  result?: string
  duration_ms?: number
  metadata?: Record<string, unknown>
}

interface TelemetryState {
  enabled: boolean
  batchSize: number
  batchIntervalMs: number
  queue: TelemetryEvent[]
  setEnabled: (enabled: boolean) => void
  track: (event: Omit<TelemetryEvent, 'timestamp'>) => void
  flush: () => Promise<void>
}

const BATCH_SIZE = 20
const BATCH_INTERVAL_MS = 5000

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let id = sessionStorage.getItem('vito-session-id')
  if (!id) {
    id = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    sessionStorage.setItem('vito-session-id', id)
  }
  return id
}

export const useTelemetryStore = create<TelemetryState>()((set, get) => ({
  enabled: typeof window !== 'undefined' && localStorage.getItem('vito-telemetry-opt-out') !== 'true',
  batchSize: BATCH_SIZE,
  batchIntervalMs: BATCH_INTERVAL_MS,
  queue: [],

  setEnabled: (enabled) => {
    localStorage.setItem('vito-telemetry-opt-out', String(!enabled))
    set({ enabled })
  },

  track: (event) => {
    if (!get().enabled) return

    const fullEvent: TelemetryEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    }

    const state = get()
    const newQueue = [...state.queue, fullEvent]

    if (newQueue.length >= state.batchSize) {
      set({ queue: [] })
      sendBatch(newQueue)
    } else {
      set({ queue: newQueue })
    }
  },

  flush: async () => {
    const { queue } = get()
    if (queue.length === 0) return
    set({ queue: [] })
    await sendBatch(queue)
  },
}))

async function sendBatch(events: TelemetryEvent[]): Promise<void> {
  if (events.length === 0) return

  const payload = {
    events: events.map((e) => ({
      ...e,
      user_id: getUserId(),
      tenant_id: getTenantId(),
      session_id: getSessionId(),
    })),
    batch_id: `batch-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    batch_size: events.length,
  }

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
      navigator.sendBeacon('/api/v1/telemetry/events', blob)
    } else {
      await fetch('/api/v1/telemetry/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      })
    }
  } catch {
    // Silently fail — telemetry must never block UX
  }
}

function getUserId(): string {
  if (typeof window === 'undefined') return 'anonymous'
  try {
    const stored = localStorage.getItem('vito-auth')
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed?.state?.user?.id?.toString() || 'anonymous'
    }
  } catch {}
  return 'anonymous'
}

function getTenantId(): string {
  if (typeof window === 'undefined') return 'unknown'
  try {
    const stored = localStorage.getItem('vito-auth')
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed?.state?.user?.company_id?.toString() || 'unknown'
    }
  } catch {}
  return 'unknown'
}

if (typeof window !== 'undefined') {
  setInterval(() => {
    useTelemetryStore.getState().flush()
  }, BATCH_INTERVAL_MS)

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      useTelemetryStore.getState().flush()
    }
  })

  const originalPush = history.pushState.bind(history)
  history.pushState = function (data, unused, url) {
    originalPush(data, unused, url)
    if (typeof url === 'string') {
      useTelemetryStore.getState().track({
        event_type: 'page_view',
        page_path: url,
      })
    }
  }

  window.addEventListener('popstate', () => {
    useTelemetryStore.getState().track({
      event_type: 'page_view',
      page_path: window.location.pathname,
    })
  })

  useTelemetryStore.getState().track({
    event_type: 'session_start',
    page_path: window.location.pathname,
  })
}

export function trackPageView(pagePath: string) {
  useTelemetryStore.getState().track({
    event_type: 'page_view',
    page_path: pagePath,
  })
}

export function trackFeatureUsage(featureId: string, featureName: string, actionType: string, result?: string) {
  useTelemetryStore.getState().track({
    event_type: 'feature_usage',
    feature_id: featureId,
    feature_name: featureName,
    action_type: actionType,
    result,
  })
}

export function trackAIInteraction(aiFeatureType: string, recommendationType: string, userAction: string, confidenceDisplayed?: number) {
  useTelemetryStore.getState().track({
    event_type: 'ai_interaction',
    feature_id: aiFeatureType,
    feature_name: recommendationType,
    action_type: userAction,
    metadata: { confidence_displayed: confidenceDisplayed },
  })
}

export function trackSearch(queryText: string, searchType: string, resultCount: number, clickedIndex?: number) {
  useTelemetryStore.getState().track({
    event_type: 'search_query',
    feature_id: searchType,
    metadata: { query_hash: simpleHash(queryText), result_count: resultCount, clicked_result_index: clickedIndex },
  })
}

function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return Math.abs(hash).toString(16)
}
