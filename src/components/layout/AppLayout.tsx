import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { Editor } from '@/components/editor/Editor'
import { Preview } from '@/components/editor/Preview'
import { Toolbar } from '@/components/editor/Toolbar'
import { StatusBar } from '@/components/editor/StatusBar'
import { AIPanel } from '@/components/ai/AIPanel'
import { useEditorStore } from '@/stores/editor'
import { useSettingsStore } from '@/stores/settings'
import { cn } from '@/lib/utils'

export function AppLayout() {
    const { content } = useEditorStore()
    const { theme, sidebarOpen, previewOpen, toggleSidebar, togglePreview } = useSettingsStore()
    const [mounted, setMounted] = useState(false)
    const [aiPanelOpen, setAIPanelOpen] = useState(false)

    const [scrollProgress, setScrollProgress] = useState(0)

    // Handle theme changes
    useEffect(() => {
        setMounted(true)
        const root = document.documentElement

        if (theme === 'dark') {
            root.classList.add('dark')
        } else if (theme === 'light') {
            root.classList.remove('dark')
        } else {
            // Auto theme - check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            if (prefersDark) {
                root.classList.add('dark')
            } else {
                root.classList.remove('dark')
            }
        }
    }, [theme])

    // Keyboard shortcuts for AI
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault()
                setAIPanelOpen(prev => !prev)
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])

    // Prevent flash of unstyled content
    if (!mounted) {
        return null
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const files = Array.from(e.dataTransfer.files)
        if (files.length === 0) return

        const file = files[0]
        if (file.name.endsWith('.md') || file.name.endsWith('.txt')) {
            const text = await file.text()
            useEditorStore.getState().setContent(text)
            useEditorStore.getState().setFileName(file.name)
            // Note: We can't get a FileSystemFileHandle from a drag event in the same way
            // as showOpenFilePicker, so we reset the handle.
            useEditorStore.getState().setFileHandle(null)
            useEditorStore.getState().setIsDirty(false)
        }
    }

    return (
        <div
            className="flex h-screen flex-col overflow-hidden bg-background"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {/* Top Toolbar */}
            <Toolbar
                onToggleSidebar={toggleSidebar}
                onTogglePreview={togglePreview}
                onToggleAI={() => setAIPanelOpen(!aiPanelOpen)}
                sidebarOpen={sidebarOpen}
                previewOpen={previewOpen}
                aiOpen={aiPanelOpen}
            />

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar
                    isOpen={sidebarOpen}
                    onToggle={toggleSidebar}
                />

                {/* Editor + Preview */}
                <main className="flex flex-1 overflow-hidden">
                    {/* Editor Pane */}
                    <div
                        className={cn(
                            "flex-1 overflow-hidden border-r border-border transition-all duration-300",
                            previewOpen ? "w-1/2" : "w-full"
                        )}
                    >
                        <Editor onScroll={setScrollProgress} />
                    </div>

                    {/* Preview Pane */}
                    {previewOpen && (
                        <div className="w-1/2 overflow-hidden bg-card">
                            <Preview content={content} scrollProgress={scrollProgress} />
                        </div>
                    )}

                    {/* AI Panel */}
                    <AIPanel isOpen={aiPanelOpen} onClose={() => setAIPanelOpen(false)} />
                </main>
            </div>

            {/* Status Bar */}
            <StatusBar />
        </div>
    )
}
