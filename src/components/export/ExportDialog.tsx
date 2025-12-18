import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, FileText, FileCode, FileType, File } from 'lucide-react'
import { exportEngine } from '@/lib/export/export-engine'
import { saveAs } from 'file-saver'
import { useEditorStore } from '@/stores/editor'
import { cn } from '@/lib/utils'
import { pdfTemplates } from '@/lib/export/pdf-templates'

interface ExportDialogProps {
    isOpen: boolean
    onClose: () => void
}

export function ExportDialog({ isOpen, onClose }: ExportDialogProps) {
    const content = useEditorStore(state => state.content)
    const fileName = useEditorStore(state => state.fileName) || 'Untitled'

    const [format, setFormat] = useState<'html' | 'pdf' | 'docx' | 'md'>('html')
    const [template, setTemplate] = useState('academic') // Default to academic template
    const [includeTOC, setIncludeTOC] = useState(true)
    const [title, setTitle] = useState(fileName.replace(/\.(md|txt)$/, ''))
    const [author, setAuthor] = useState('')
    const [isExporting, setIsExporting] = useState(false)

    const dialogRef = useRef<HTMLDivElement>(null)
    const titleInputRef = useRef<HTMLInputElement>(null)

    // Focus management
    useEffect(() => {
        if (isOpen && titleInputRef.current) {
            setTimeout(() => titleInputRef.current?.focus(), 100)
        }
    }, [isOpen])

    // Keyboard handling
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return

            if (e.key === 'Escape') {
                onClose()
            } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                handleExport()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, title, format, template, includeTOC, author])

    const handleExport = async () => {
        try {
            setIsExporting(true)
            const blob = await exportEngine.export(content, {
                format,
                template,
                includeTOC: format !== 'md' && includeTOC,
                metadata: {
                    title,
                    author
                }
            })

            const extension = format === 'md' ? 'md' : format
            saveAs(blob, `${title}.${extension}`)
            onClose()
        } catch (error) {
            console.error('Export failed:', error)
            alert('Export failed. Check console for details.')
        } finally {
            setIsExporting(false)
        }
    }

    const formats = [
        { id: 'html', label: 'HTML', icon: FileCode, desc: 'Web-ready standalone file' },
        { id: 'pdf', label: 'PDF', icon: FileType, desc: 'Printable document' },
        { id: 'docx', label: 'Word', icon: FileText, desc: 'Microsoft Word compatible' },
        { id: 'md', label: 'Markdown', icon: File, desc: 'Raw source file' },
    ] as const

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="export-dialog-title"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Dialog */}
                    <motion.div
                        ref={dialogRef}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="relative w-full max-w-lg rounded-xl bg-background shadow-2xl ring-1 ring-border"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-border p-4">
                            <h2 id="export-dialog-title" className="text-lg font-semibold">Export Document</h2>
                            <button
                                onClick={onClose}
                                className="rounded-lg p-1 hover:bg-muted transition-colors"
                                aria-label="Close dialog"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Format Selection */}
                            <div role="group" aria-labelledby="format-label">
                                <span id="format-label" className="sr-only">Select export format</span>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {formats.map(f => (
                                        <button
                                            key={f.id}
                                            onClick={() => setFormat(f.id)}
                                            className={cn(
                                                "flex flex-col items-center justify-center gap-2 rounded-lg border p-3 transition-all hover:bg-muted",
                                                format === f.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"
                                            )}
                                            aria-pressed={format === f.id}
                                            aria-label={`Export as ${f.label}: ${f.desc}`}
                                        >
                                            <f.icon className={cn("h-6 w-6", format === f.id ? "text-primary" : "text-muted-foreground")} aria-hidden="true" />
                                            <span className="text-sm font-medium">{f.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Options */}
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <label htmlFor="export-title" className="text-sm font-medium">Document Title</label>
                                    <input
                                        ref={titleInputRef}
                                        id="export-title"
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                                        aria-required="true"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="export-author" className="text-sm font-medium">Author (Optional)</label>
                                    <input
                                        id="export-author"
                                        type="text"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>

                                {format !== 'md' && (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="include-toc"
                                            checked={includeTOC}
                                            onChange={(e) => setIncludeTOC(e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300"
                                            aria-describedby="toc-description"
                                        />
                                        <label htmlFor="include-toc" className="text-sm">
                                            Include Table of Contents
                                            <span id="toc-description" className="sr-only">Automatically generate a table of contents from document headings</span>
                                        </label>
                                    </div>
                                )}

                                {format === 'pdf' && (
                                    <div className="grid gap-2">
                                        <label htmlFor="export-template" className="text-sm font-medium">PDF Template</label>
                                        <select
                                            id="export-template"
                                            value={template}
                                            onChange={(e) => setTemplate(e.target.value)}
                                            className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            {pdfTemplates.map(t => (
                                                <option key={t.id} value={t.id}>
                                                    {t.name} - {t.description}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {format === 'html' && (
                                    <div className="grid gap-2">
                                        <label htmlFor="export-template" className="text-sm font-medium">Template</label>
                                        <select
                                            id="export-template"
                                            value={template}
                                            onChange={(e) => setTemplate(e.target.value)}
                                            className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            <option value="default">Default</option>
                                            <option value="academic">Academic (Serif)</option>
                                            <option value="modern">Modern (Inter)</option>
                                            <option value="technical">Technical</option>
                                            <option value="minimalist">Minimalist</option>
                                            <option value="typewriter">Typewriter</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end border-t border-border p-4 bg-muted/20">
                            <button
                                onClick={onClose}
                                className="mr-3 rounded-md px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleExport}
                                disabled={isExporting || !title.trim()}
                                className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                aria-label={isExporting ? 'Exporting document...' : `Export as ${format.toUpperCase()}`}
                            >
                                {isExporting ? 'Exporting...' : (
                                    <>
                                        <Download className="h-4 w-4" aria-hidden="true" />
                                        Export {format.toUpperCase()}
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
