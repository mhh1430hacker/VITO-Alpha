'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { AlphaConfig } from './config'
import { AlphaDataProvider, type AlphaDataset } from './data-provider'
import { DemoWorkspaceFactory, type DemoWorkspace } from './workspace-factory'

interface AlphaContextValue {
  alphaData: AlphaDataset | null
  currentWorkspace: DemoWorkspace | null
  isAlpha: boolean
  alphaConfig: typeof AlphaConfig
  refreshData: () => void
  createWorkspace: (name: string) => DemoWorkspace
}

const AlphaContext = createContext<AlphaContextValue>({
  alphaData: null,
  currentWorkspace: null,
  isAlpha: false,
  alphaConfig: AlphaConfig,
  refreshData: () => {},
  createWorkspace: () => {
    throw new Error('AlphaContext not initialized')
  },
})

export function AlphaProvider({ children }: { children: ReactNode }) {
  const [alphaData, setAlphaData] = useState<AlphaDataset | null>(null)
  const [currentWorkspace, setCurrentWorkspace] = useState<DemoWorkspace | null>(null)

  const isAlpha = AlphaConfig.enabled

  const initialize = useCallback(() => {
    if (!AlphaConfig.enabled) {
      setAlphaData(null)
      setCurrentWorkspace(null)
      return
    }

    const provider = AlphaDataProvider.getInstance()
    const dataset = provider.getDatasets()
    setAlphaData(dataset)

    const factory = DemoWorkspaceFactory.getInstance()
    const workspaces = factory.listWorkspaces()
    if (workspaces.length > 0) {
      setCurrentWorkspace(workspaces[0])
    } else {
      const ws = factory.createWorkspace()
      setCurrentWorkspace(ws)
    }
  }, [])

  useEffect(() => {
    initialize()
  }, [initialize])

  const refreshData = useCallback(() => {
    if (!AlphaConfig.enabled) return
    const provider = AlphaDataProvider.getInstance()
    const dataset = provider.getDatasets()
    setAlphaData(dataset)
  }, [])

  const createWorkspaceHandler = useCallback(
    (name: string): DemoWorkspace => {
      const factory = DemoWorkspaceFactory.getInstance()
      const ws = factory.createWorkspace(name)
      setCurrentWorkspace(ws)
      return ws
    },
    []
  )

  return (
    <AlphaContext.Provider
      value={{
        alphaData,
        currentWorkspace,
        isAlpha,
        alphaConfig: AlphaConfig,
        refreshData,
        createWorkspace: createWorkspaceHandler,
      }}
    >
      {children}
    </AlphaContext.Provider>
  )
}

export function useAlpha(): AlphaContextValue {
  return useContext(AlphaContext)
}

export function useAlphaData(): AlphaDataset | null {
  const { isAlpha, alphaData } = useContext(AlphaContext)
  if (!isAlpha) return null
  return alphaData
}

export function useAlphaWorkspace(): DemoWorkspace | null {
  const { isAlpha, currentWorkspace } = useContext(AlphaContext)
  if (!isAlpha) return null
  return currentWorkspace
}
