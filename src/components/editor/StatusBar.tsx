import { useEditorStore } from '@/stores/editor'
import { useSettingsStore } from '@/stores/settings'
import { countWords, countCharacters, calculateReadingTime } from '@/lib/utils'

export function StatusBar() {
    const { content, cursorPosition, lastSaved, isDirty } = useEditorStore()
    const { vimMode } = useSettingsStore()

    const wordCount = countWords(content)
    const charCount = countCharacters(content)
    const readingTime = calculateReadingTime(content)

    const formatLastSaved = () => {
        if (!lastSaved) return null
        const now = new Date()
        const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000)

        if (diff < 5) return 'Just saved'
        if (diff < 60) return `Saved ${diff}s ago`
        if (diff < 3600) return `Saved ${Math.floor(diff / 60)}m ago`
        return `Saved ${Math.floor(diff / 3600)}h ago`
    }

    const savedStatus = formatLastSaved()

    return (
        <footer className="flex h-6 items-center justify-between border-t border-border bg-card px-4 text-xs text-muted-foreground">
            {/* Left side - cursor position and mode */}
            <div className="flex items-center gap-4">
                <span>
                    Ln {cursorPosition.line}, Col {cursorPosition.column}
                </span>
                {vimMode && (
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-primary">
                        VIM
                    </span>
                )}
            </div>

            {/* Center - document stats */}
            <div className="flex items-center gap-4">
                <span>{wordCount.toLocaleString()} words</span>
                <span>{charCount.toLocaleString()} characters</span>
                <span>{readingTime} min read</span>
            </div>

            {/* Right side - save status */}
            <div className="flex items-center gap-2">
                {isDirty && (
                    <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" />
                        Unsaved changes
                    </span>
                )}
                {savedStatus && !isDirty && (
                    <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        {savedStatus}
                    </span>
                )}
            </div>
        </footer>
    )
}
