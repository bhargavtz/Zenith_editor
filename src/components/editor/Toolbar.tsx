import { useState } from 'react'
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Link,
    Image,
    List,
    ListOrdered,
    CheckSquare,
    Quote,
    Minus,
    Heading1,
    Heading2,
    Heading3,
    PanelLeft,
    PanelRight,
    Sun,
    Moon,
    Monitor,
    FileText,
    FolderOpen,
    Save,
    Download,
    Settings,
    Keyboard,
    HelpCircle,
    Sparkles,
    LayoutTemplate,
} from 'lucide-react'
import { useSettingsStore } from '@/stores/settings'
import { useEditorStore } from '@/stores/editor'
import { cn } from '@/lib/utils'
import { ExportDialog } from '@/components/export/ExportDialog'
import { TemplateGallery } from '@/components/templates/TemplateGallery'
import { markdownCommands, getEditorView } from '@/lib/markdown-commands'

interface ToolbarProps {
    onToggleSidebar: () => void
    onTogglePreview: () => void
    onToggleAI?: () => void
    sidebarOpen: boolean
    previewOpen: boolean
    aiOpen?: boolean
}

interface ToolbarButtonProps {
    icon: React.ReactNode
    label: string
    onClick?: () => void
    active?: boolean
    disabled?: boolean
    className?: string
}

function ToolbarButton({ icon, label, onClick, active, disabled, className }: ToolbarButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={label}
            className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors",
                "hover:bg-muted hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active && "bg-muted text-foreground",
                disabled && "cursor-not-allowed opacity-50",
                className
            )}
        >
            {icon}
        </button>
    )
}

function ToolbarDivider() {
    return <div className="mx-1 h-6 w-px bg-border" />
}

export function Toolbar({ onToggleSidebar, onTogglePreview, onToggleAI, sidebarOpen, previewOpen, aiOpen = false }: ToolbarProps) {
    const { theme, setTheme, vimMode, setVimMode } = useSettingsStore()
    const { fileName, isDirty } = useEditorStore()
    const [exportOpen, setExportOpen] = useState(false)
    const [templateGalleryOpen, setTemplateGalleryOpen] = useState(false)

    const cycleTheme = () => {
        if (theme === 'light') setTheme('dark')
        else if (theme === 'dark') setTheme('auto')
        else setTheme('light')
    }

    const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor

    const handleOpenFile = async () => {
        try {
            if ('showOpenFilePicker' in window) {
                const [fileHandle] = await window.showOpenFilePicker({
                    types: [
                        {
                            description: 'Markdown files',
                            accept: { 'text/markdown': ['.md', '.markdown'] },
                        },
                        {
                            description: 'Text files',
                            accept: { 'text/plain': ['.txt'] },
                        },
                    ],
                })
                const file = await fileHandle.getFile()
                const content = await file.text()
                useEditorStore.getState().setContent(content)
                useEditorStore.getState().setFileName(file.name)
                useEditorStore.getState().setFileHandle(fileHandle)
                useEditorStore.getState().setIsDirty(false)
            }
        } catch (error) {
            // User cancelled file picker
            console.log('File open cancelled')
        }
    }

    const handleSaveFile = async () => {
        const { content, fileHandle } = useEditorStore.getState()

        try {
            if (fileHandle) {
                // Save to existing file
                const writable = await fileHandle.createWritable()
                await writable.write(content)
                await writable.close()
            } else if ('showSaveFilePicker' in window) {
                // Save as new file
                const newHandle = await window.showSaveFilePicker({
                    suggestedName: 'document.md',
                    types: [
                        {
                            description: 'Markdown files',
                            accept: { 'text/markdown': ['.md'] },
                        },
                    ],
                })
                const writable = await newHandle.createWritable()
                await writable.write(content)
                await writable.close()
                useEditorStore.getState().setFileHandle(newHandle)
                useEditorStore.getState().setFileName(newHandle.name)
            }
            useEditorStore.getState().setIsDirty(false)
            useEditorStore.getState().setLastSaved(new Date())
        } catch (error) {
            console.log('File save cancelled or failed')
        }
    }

    const handleNewFile = () => {
        useEditorStore.getState().resetDocument()
        useEditorStore.getState().setContent('# New Document\n\nStart writing...')
        useEditorStore.getState().setFileName('Untitled.md')
    }

    return (
        <header className="flex h-12 items-center justify-between border-b border-border bg-card px-2">
            {/* Left section - Logo and file info */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-2">
                    <img src="/zenith.svg" alt="Zenith" className="h-6 w-6" />
                    <span className="text-lg font-semibold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                        Zenith
                    </span>
                </div>

                <ToolbarDivider />

                <div className="flex items-center gap-1">
                    <ToolbarButton
                        icon={<FileText className="h-4 w-4" />}
                        label="New file (Ctrl+N)"
                        onClick={handleNewFile}
                    />
                    <ToolbarButton
                        icon={<LayoutTemplate className="h-4 w-4" />}
                        label="New from template"
                        onClick={() => setTemplateGalleryOpen(true)}
                        className="text-accent hover:text-accent"
                    />
                    <ToolbarButton
                        icon={<FolderOpen className="h-4 w-4" />}
                        label="Open file (Ctrl+O)"
                        onClick={handleOpenFile}
                    />
                    <ToolbarButton
                        icon={<Save className="h-4 w-4" />}
                        label="Save file (Ctrl+S)"
                        onClick={handleSaveFile}
                    />
                </div>

                <ToolbarDivider />

                {/* File name */}
                <div className="flex items-center gap-1 text-sm">
                    <span className="text-muted-foreground">
                        {fileName || 'Untitled.md'}
                    </span>
                    {isDirty && (
                        <span className="text-xs text-muted-foreground">•</span>
                    )}
                </div>
            </div>

            {/* Center section - Formatting tools */}
            <div className="hidden md:flex items-center gap-1">
                <ToolbarButton
                    icon={<Heading1 className="h-4 w-4" />}
                    label="Heading 1"
                    onClick={() => {
                        const view = getEditorView()
                        if (view) markdownCommands.insertHeading(view, 1)
                    }}
                />
                <ToolbarButton
                    icon={<Heading2 className="h-4 w-4" />}
                    label="Heading 2"
                    onClick={() => {
                        const view = getEditorView()
                        if (view) markdownCommands.insertHeading(view, 2)
                    }}
                />
                <ToolbarButton
                    icon={<Heading3 className="h-4 w-4" />}
                    label="Heading 3"
                    onClick={() => {
                        const view = getEditorView()
                        if (view) markdownCommands.insertHeading(view, 3)
                    }}
                />

                <ToolbarDivider />

                <ToolbarButton
                    icon={<Bold className="h-4 w-4" />}
                    label="Bold (Ctrl+B)"
                    onClick={() => {
                        const view = getEditorView()
                        if (view) markdownCommands.toggleBold(view)
                    }}
                />
                <ToolbarButton
                    icon={<Italic className="h-4 w-4" />}
                    label="Italic (Ctrl+I)"
                    onClick={() => {
                        const view = getEditorView()
                        if (view) markdownCommands.toggleItalic(view)
                    }}
                />
                <ToolbarButton
                    icon={<Strikethrough className="h-4 w-4" />}
                    label="Strikethrough"
                    onClick={() => {
                        const view = getEditorView()
                        if (view) markdownCommands.toggleStrikethrough(view)
                    }}
                />
                <ToolbarButton
                    icon={<Code className="h-4 w-4" />}
                    label="Code"
                    onClick={() => {
                        const view = getEditorView()
                        if (view) markdownCommands.toggleCode(view)
                    }}
                />

                <ToolbarDivider />

                <ToolbarButton
                    icon={<Link className="h-4 w-4" />}
                    label="Insert link (Ctrl+K)"
                    onClick={() => {
                        const view = getEditorView()
                        if (view) markdownCommands.insertLink(view)
                    }}
                />
                <ToolbarButton
                    icon={<Image className="h-4 w-4" />}
                    label="Insert image"
                    onClick={() => {
                        const view = getEditorView()
                        if (view) markdownCommands.insertImage(view)
                    }}
                />

                <ToolbarDivider />

                <ToolbarButton
                    icon={<List className="h-4 w-4" />}
                    label="Bullet list"
                    onClick={() => {
                        const view = getEditorView()
                        if (view) markdownCommands.insertUnorderedList(view)
                    }}
                />
                <ToolbarButton
                    icon={<ListOrdered className="h-4 w-4" />}
                    label="Numbered list"
                    onClick={() => {
                        const view = getEditorView()
                        if (view) markdownCommands.insertOrderedList(view)
                    }}
                />
                <ToolbarButton
                    icon={<CheckSquare className="h-4 w-4" />}
                    label="Task list"
                    onClick={() => {
                        const view = getEditorView()
                        if (view) markdownCommands.insertTaskList(view)
                    }}
                />

                <ToolbarDivider />

                <ToolbarButton
                    icon={<Quote className="h-4 w-4" />}
                    label="Blockquote"
                    onClick={() => {
                        const view = getEditorView()
                        if (view) markdownCommands.insertBlockquote(view)
                    }}
                />
                <ToolbarButton
                    icon={<Minus className="h-4 w-4" />}
                    label="Horizontal rule"
                    onClick={() => {
                        const view = getEditorView()
                        if (view) markdownCommands.insertHorizontalRule(view)
                    }}
                />
            </div>

            {/* Right section - View controls */}
            <div className="flex items-center gap-1">
                <ToolbarButton
                    icon={<PanelLeft className="h-4 w-4" />}
                    label="Toggle sidebar"
                    onClick={onToggleSidebar}
                    active={sidebarOpen}
                />
                <ToolbarButton
                    icon={<PanelRight className="h-4 w-4" />}
                    label="Toggle preview (Ctrl+P)"
                    onClick={onTogglePreview}
                    active={previewOpen}
                />

                <ToolbarDivider />

                <ToolbarButton
                    icon={<Keyboard className="h-4 w-4" />}
                    label={vimMode ? "Vim mode on" : "Vim mode off"}
                    onClick={() => setVimMode(!vimMode)}
                    active={vimMode}
                />
                <ToolbarButton
                    icon={<ThemeIcon className="h-4 w-4" />}
                    label={`Theme: ${theme}`}
                    onClick={cycleTheme}
                />
                <ToolbarButton
                    icon={<Download className="h-4 w-4" />}
                    label="Export"
                    onClick={() => setExportOpen(true)}
                />
                <ToolbarButton
                    icon={<Sparkles className="h-4 w-4" />}
                    label="AI Assistant (Ctrl+K)"
                    onClick={onToggleAI}
                    active={aiOpen}
                />
                <ToolbarButton
                    icon={<Settings className="h-4 w-4" />}
                    label="Settings"
                />
                <ToolbarButton
                    icon={<HelpCircle className="h-4 w-4" />}
                    label="Help"
                />
            </div>

            <ExportDialog isOpen={exportOpen} onClose={() => setExportOpen(false)} />
            <TemplateGallery isOpen={templateGalleryOpen} onClose={() => setTemplateGalleryOpen(false)} />
        </header>
    )
}
