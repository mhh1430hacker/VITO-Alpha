import { create } from 'zustand'

interface User {
  id: string
  email: string
  full_name: string
  role: string
  avatar_url: string | null
}

// ──────────────────────────────────────
// Auth Store
// ──────────────────────────────────────

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  setAuth: (user: User, token: string, refreshToken?: string) => void
  setTokens: (token: string, refreshToken: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  (set) => ({
    user: { id: 'alpha-guest', email: 'explorer@vito-alpha.demo', full_name: 'VITO Explorer', role: 'perfumer', avatar_url: null },
    token: 'alpha-guest-token',
    refreshToken: 'alpha-refresh-token',
    setAuth: (user, token, refreshToken) => set({ user, token, refreshToken }),
    setTokens: (token, refreshToken) => set({ token, refreshToken }),
    logout: () => set({ user: null, token: null, refreshToken: null }),
  })
)

// ──────────────────────────────────────
// Sidebar Store
// ──────────────────────────────────────

interface SidebarState {
  collapsed: boolean
  activeSection: string | null
  sectionsExpanded: Record<string, boolean>
  toggleCollapsed: () => void
  setActiveSection: (section: string | null) => void
  toggleSection: (section: string) => void
  setSectionExpanded: (section: string, expanded: boolean) => void
}

export const useSidebarStore = create<SidebarState>()(
  (set) => ({
    collapsed: false,
    activeSection: null,
    sectionsExpanded: {},
    toggleCollapsed: () => set((s) => ({ collapsed: !s.collapsed })),
    setActiveSection: (section) => set({ activeSection: section }),
    toggleSection: (section) =>
      set((s) => ({
        sectionsExpanded: {
          ...s.sectionsExpanded,
          [section]: !s.sectionsExpanded[section],
        },
      })),
    setSectionExpanded: (section, expanded) =>
      set((s) => ({
        sectionsExpanded: { ...s.sectionsExpanded, [section]: expanded },
      })),
  })
)

// ──────────────────────────────────────
// UI Store
// ──────────────────────────────────────

interface UIState {
  globalSearchOpen: boolean
  notificationsOpen: boolean
  commandPaletteOpen: boolean
  density: 'comfortable' | 'compact'
  setGlobalSearchOpen: (open: boolean) => void
  setNotificationsOpen: (open: boolean) => void
  setCommandPaletteOpen: (open: boolean) => void
  setDensity: (density: 'comfortable' | 'compact') => void
}

export const useUIStore = create<UIState>()(
  (set) => ({
    globalSearchOpen: false,
    notificationsOpen: false,
    commandPaletteOpen: false,
    density: 'comfortable',
    setGlobalSearchOpen: (open) => set({ globalSearchOpen: open }),
    setNotificationsOpen: (open) => set({ notificationsOpen: open }),
    setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
    setDensity: (density) => set({ density }),
  })
)

// ──────────────────────────────────────
// Demo Store
// ──────────────────────────────────────

interface DemoState {
  isDemoMode: boolean
  setDemoMode: (enabled: boolean) => void
  toggleDemoMode: () => void
  isScriptMode: boolean
  setScriptMode: (enabled: boolean) => void
  currentScriptStep: number
  nextScriptStep: () => void
  prevScriptStep: () => void
  currentScenario: number | null
  setCurrentScenario: (id: number | null) => void
  resetDemo: () => void
}

export const useDemoStore = create<DemoState>()(
  (set, get) => ({
    isDemoMode: false,
    isScriptMode: false,
    currentScriptStep: 0,
    currentScenario: null,
    setDemoMode: (enabled) => set({ isDemoMode: enabled, isScriptMode: false, currentScriptStep: 0, currentScenario: null }),
    toggleDemoMode: () => set((s) => ({ isDemoMode: !s.isDemoMode, isScriptMode: false, currentScriptStep: 0, currentScenario: null })),
    setScriptMode: (enabled) => set({ isScriptMode: enabled }),
    setCurrentScenario: (id) => set({ currentScenario: id, currentScriptStep: 0 }),
    nextScriptStep: () => set((s) => ({ currentScriptStep: s.currentScriptStep + 1 })),
    prevScriptStep: () => set((s) => ({ currentScriptStep: Math.max(0, s.currentScriptStep - 1) })),
    resetDemo: () => set({ isDemoMode: false, isScriptMode: false, currentScriptStep: 0, currentScenario: null }),
  })
)

// ──────────────────────────────────────
// Investor Store
// ──────────────────────────────────────

interface InvestorState {
  isInvestorMode: boolean
  isAuthenticated: boolean
  authenticate: (code: string) => boolean
  logout: () => void
}

export const useInvestorStore = create<InvestorState>()(
  (set) => ({
    isInvestorMode: false,
    isAuthenticated: false,
    authenticate: () => {
      set({ isAuthenticated: true, isInvestorMode: true })
      return true
    },
    logout: () => set({ isAuthenticated: false, isInvestorMode: false }),
  })
)

// ──────────────────────────────────────
// Chat / AI Assistant Types
// ──────────────────────────────────────

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  context?: string
}

// ──────────────────────────────────────
// AI Assistant Store
// ──────────────────────────────────────

interface AIAssistantState {
  open: boolean
  messages: ChatMessage[]
  isThinking: boolean
  setOpen: (open: boolean) => void
  addMessage: (msg: ChatMessage) => void
  setThinking: (thinking: boolean) => void
  clearMessages: () => void
}

export const useAIAssistantStore = create<AIAssistantState>()(
  (set) => ({
    open: false,
    messages: [],
    isThinking: false,
    setOpen: (open) => set({ open }),
    addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
    setThinking: (thinking) => set({ isThinking: thinking }),
    clearMessages: () => set({ messages: [] }),
  })
)

// ──────────────────────────────────────
// Notification Types
// ──────────────────────────────────────

export interface AppNotification {
  id: string
  title: string
  message?: string
  type: 'success' | 'error' | 'warning' | 'info'
  read: boolean
  createdAt: string
  actionUrl?: string
}

// ──────────────────────────────────────
// Notification Store
// ──────────────────────────────────────

interface NotificationState {
  notifications: AppNotification[]
  unreadCount: number
  panelOpen: boolean
  addNotification: (n: AppNotification) => void
  markRead: (id: string) => void
  markAllRead: () => void
  setPanelOpen: (open: boolean) => void
  removeNotification: (id: string) => void
}

export const useNotificationStore = create<NotificationState>()(
  (set, get) => ({
    notifications: [],
    unreadCount: 0,
    panelOpen: false,
    addNotification: (n) =>
      set((s) => ({
        notifications: [n, ...s.notifications],
        unreadCount: s.unreadCount + (n.read ? 0 : 1),
      })),
    markRead: (id) =>
      set((s) => {
        const updated = s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
        return { notifications: updated, unreadCount: updated.filter((n) => !n.read).length }
      }),
    markAllRead: () =>
      set((s) => ({
        notifications: s.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      })),
    setPanelOpen: (open) => set({ panelOpen: open }),
    removeNotification: (id) =>
      set((s) => {
        const updated = s.notifications.filter((n) => n.id !== id)
        return { notifications: updated, unreadCount: updated.filter((n) => !n.read).length }
      }),
  })
)

// ──────────────────────────────────────
// Workspace Types & Store
// ──────────────────────────────────────

export interface Workspace {
  id: string
  name: string
  avatar?: string
  memberCount: number
  isActive: boolean
}

interface WorkspaceState {
  workspaces: Workspace[]
  activeWorkspaceId: string | null
  setWorkspaces: (workspaces: Workspace[]) => void
  setActiveWorkspace: (id: string) => void
  addWorkspace: (workspace: Workspace) => void
}

export const useWorkspaceStore = create<WorkspaceState>()(
  (set) => ({
    workspaces: [
      { id: 'personal', name: 'Personal Workspace', memberCount: 1, isActive: true },
      { id: 'rnd', name: 'R&D Department', memberCount: 12, isActive: false },
      { id: 'compliance', name: 'Compliance Team', memberCount: 5, isActive: false },
    ],
    activeWorkspaceId: 'personal',
    setWorkspaces: (workspaces) => set({ workspaces }),
    setActiveWorkspace: (id) =>
      set((s) => ({
        activeWorkspaceId: id,
        workspaces: s.workspaces.map((w) => ({ ...w, isActive: w.id === id })),
      })),
    addWorkspace: (workspace) => set((s) => ({ workspaces: [...s.workspaces, workspace] })),
  })
)
