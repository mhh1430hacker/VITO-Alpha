const STORAGE_KEY = 'vito_first_mission'

export type MissionStep = 'create_formula' | 'run_prediction' | 'explore'

export interface MissionState {
  completed: boolean
  currentStep: MissionStep
  formulaCreated: boolean
  predictionRun: boolean
  explorationDone: boolean
  dismissed: boolean
}

export function loadMission(): MissionState {
  if (typeof window === 'undefined') return defaultMission()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultMission()
    return { ...defaultMission(), ...JSON.parse(raw) }
  } catch {
    return defaultMission()
  }
}

export function saveMission(state: MissionState): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }
}

function defaultMission(): MissionState {
  return {
    completed: false,
    currentStep: 'create_formula',
    formulaCreated: false,
    predictionRun: false,
    explorationDone: false,
    dismissed: false,
  }
}

export function completeStep(
  state: MissionState,
  step: MissionStep,
): MissionState {
  const next = { ...state }

  switch (step) {
    case 'create_formula':
      next.formulaCreated = true
      next.currentStep = 'run_prediction'
      break
    case 'run_prediction':
      next.predictionRun = true
      next.currentStep = 'explore'
      break
    case 'explore':
      next.explorationDone = true
      next.completed = true
      break
  }

  saveMission(next)
  return next
}

export function dismissMission(state: MissionState): MissionState {
  const next = { ...state, dismissed: true }
  saveMission(next)
  return next
}

export function isFirstRun(): boolean {
  const mission = loadMission()
  return !mission.completed && !mission.dismissed
}
