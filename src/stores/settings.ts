import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'auto'
export type EditorFontFamily = 'mono' | 'sans' | 'serif'

export interface SettingsState {
    // Appearance
    theme: Theme
    fontSize: number
    fontFamily: EditorFontFamily
    lineHeight: number

    // Editor behavior
    tabSize: 2 | 4
    lineNumbers: boolean
    wordWrap: boolean
    vimMode: boolean

    // Layout
    sidebarOpen: boolean
    previewOpen: boolean
    previewPosition: 'right' | 'bottom'

    // Auto-save
    autoSave: boolean
    autoSaveInterval: number // in milliseconds

    // Actions
    setTheme: (theme: Theme) => void
    setFontSize: (size: number) => void
    setFontFamily: (family: EditorFontFamily) => void
    setLineHeight: (height: number) => void
    setTabSize: (size: 2 | 4) => void
    setLineNumbers: (show: boolean) => void
    setWordWrap: (wrap: boolean) => void
    setVimMode: (enabled: boolean) => void
    toggleSidebar: () => void
    togglePreview: () => void
    setPreviewPosition: (position: 'right' | 'bottom') => void
    setAutoSave: (enabled: boolean) => void
    setAutoSaveInterval: (interval: number) => void
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            // Default appearance
            theme: 'dark',
            fontSize: 14,
            fontFamily: 'mono',
            lineHeight: 1.6,

            // Default editor behavior
            tabSize: 2,
            lineNumbers: true,
            wordWrap: true,
            vimMode: false,

            // Default layout
            sidebarOpen: true,
            previewOpen: true,
            previewPosition: 'right',

            // Default auto-save
            autoSave: true,
            autoSaveInterval: 2000,

            // Actions
            setTheme: (theme) => set({ theme }),
            setFontSize: (fontSize) => set({ fontSize }),
            setFontFamily: (fontFamily) => set({ fontFamily }),
            setLineHeight: (lineHeight) => set({ lineHeight }),
            setTabSize: (tabSize) => set({ tabSize }),
            setLineNumbers: (lineNumbers) => set({ lineNumbers }),
            setWordWrap: (wordWrap) => set({ wordWrap }),
            setVimMode: (vimMode) => set({ vimMode }),
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
            togglePreview: () => set((state) => ({ previewOpen: !state.previewOpen })),
            setPreviewPosition: (previewPosition) => set({ previewPosition }),
            setAutoSave: (autoSave) => set({ autoSave }),
            setAutoSaveInterval: (autoSaveInterval) => set({ autoSaveInterval }),
        }),
        {
            name: 'zenith-settings-storage',
        }
    )
)
