import { create } from 'zustand'
import type { Project } from './types'

interface ProjectStore {
  selectedProject: Project | null
  setSelectedProject: (project: Project | null) => void
}

export const useProjectStore = create<ProjectStore>((set) => ({
  selectedProject: null,
  setSelectedProject: (project) => set({ selectedProject: project }),
}))
