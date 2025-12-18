import { useEffect, useRef, useCallback } from 'react'
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine } from '@codemirror/view'
import { EditorState, Extension } from '@codemirror/state'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldGutter, indentOnInput, foldKeymap } from '@codemirror/language'
import { closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete'
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search'
import { lintKeymap } from '@codemirror/lint'
import { vim } from '@replit/codemirror-vim'
import { oneDark } from '@codemirror/theme-one-dark'
import { useEditorStore } from '@/stores/editor'
import { useSettingsStore } from '@/stores/settings'
import { debounce } from '@/lib/utils'
import '@/styles/editor.css'

// Light theme
const lightTheme = EditorView.theme({
    '&': {
        backgroundColor: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
    },
    '.cm-content': {
        caretColor: 'hsl(var(--primary))',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    '.cm-cursor, .cm-dropCursor': {
        borderLeftColor: 'hsl(var(--primary))',
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
        backgroundColor: 'hsl(var(--primary) / 0.2)',
    },
    '.cm-activeLine': {
        backgroundColor: 'hsl(var(--muted) / 0.5)',
    },
    '.cm-gutters': {
        backgroundColor: 'hsl(var(--background))',
        color: 'hsl(var(--muted-foreground))',
        border: 'none',
    },
    '.cm-activeLineGutter': {
        backgroundColor: 'hsl(var(--muted) / 0.5)',
    },
    '.cm-lineNumbers .cm-gutterElement': {
        padding: '0 8px 0 16px',
    },
})
import { db } from '@/lib/storage/db'
import { useDocumentsStore } from '@/stores/documents'

interface EditorProps {
    onScroll?: (percentage: number) => void
}

export function Editor({ onScroll }: EditorProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const editorRef = useRef<EditorView | null>(null)

    const { content, setContent, setCursorPosition, setLastSaved, setIsDirty } = useEditorStore()
    const { theme, fontSize, lineNumbers: showLineNumbers, wordWrap, vimMode, tabSize } = useSettingsStore()
    const currentDocumentId = useDocumentsStore(state => state.currentDocumentId)

    // Debounced save function
    const debouncedSave = useCallback(
        debounce(async () => {
            setLastSaved(new Date())
            setIsDirty(false)

            // Save to Dexie if it's a managed document
            if (currentDocumentId) {
                try {
                    await db.documents.update(currentDocumentId, {
                        content: useEditorStore.getState().content,
                        updatedAt: new Date()
                    })
                } catch (error) {
                    console.error('Failed to auto-save to Dexie:', error)
                }
            }
        }, 2000),
        [currentDocumentId]
    )

    // Handle content changes
    const handleChange = useCallback((newContent: string) => {
        setContent(newContent)
        debouncedSave()
    }, [setContent, debouncedSave])

    // Build extensions array
    const getExtensions = useCallback((): Extension[] => {
        const extensions: Extension[] = [
            // Basic setup
            highlightActiveLineGutter(),
            highlightSpecialChars(),
            history(),
            foldGutter(),
            drawSelection(),
            dropCursor(),
            EditorState.allowMultipleSelections.of(true),
            indentOnInput(),
            syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
            bracketMatching(),
            closeBrackets(),
            rectangularSelection(),
            crosshairCursor(),
            highlightActiveLine(),
            highlightSelectionMatches(),

            // Keymaps
            keymap.of([
                ...closeBracketsKeymap,
                ...defaultKeymap,
                ...searchKeymap,
                ...historyKeymap,
                ...foldKeymap,
                ...completionKeymap,
                ...lintKeymap,
                indentWithTab,
            ]),

            // Markdown language
            markdown({
                base: markdownLanguage,
                codeLanguages: languages,
            }),

            // Tab size
            EditorState.tabSize.of(tabSize),

            // Update listener
            EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                    handleChange(update.state.doc.toString())
                }
                if (update.selectionSet) {
                    const pos = update.state.selection.main.head
                    const line = update.state.doc.lineAt(pos)
                    setCursorPosition(line.number, pos - line.from + 1)
                }
            }),

            // Scroll listener
            EditorView.domEventHandlers({
                scroll: (_event, view) => {
                    if (onScroll) {
                        const scrolled = view.scrollDOM.scrollTop
                        const maxScroll = view.scrollDOM.scrollHeight - view.scrollDOM.clientHeight
                        const percentage = maxScroll > 0 ? scrolled / maxScroll : 0
                        onScroll(percentage)
                    }
                }
            }),

            // Placeholder
            EditorView.contentAttributes.of({ 'aria-label': 'Markdown Editor' }),
        ]

        // Line numbers
        if (showLineNumbers) {
            extensions.push(lineNumbers())
        }

        // Word wrap
        if (wordWrap) {
            extensions.push(EditorView.lineWrapping)
        }

        // Theme
        if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            extensions.push(oneDark)
        } else {
            extensions.push(lightTheme)
        }

        // Vim mode
        if (vimMode) {
            extensions.push(vim())
        }

        // Font size
        extensions.push(EditorView.theme({
            '.cm-content': {
                fontSize: `${fontSize}px`,
            },
            '.cm-gutters': {
                fontSize: `${fontSize}px`,
            },
        }))

        return extensions
    }, [theme, fontSize, showLineNumbers, wordWrap, vimMode, tabSize, handleChange, setCursorPosition])

    // Initialize editor
    useEffect(() => {
        if (!containerRef.current) return

        const state = EditorState.create({
            doc: content,
            extensions: getExtensions(),
        })

        const view = new EditorView({
            state,
            parent: containerRef.current,
        })

        editorRef.current = view
            // Make editor view accessible to toolbar commands
            ; (window as any).__zenithEditorView = view

        return () => {
            ; (window as any).__zenithEditorView = null
            view.destroy()
        }
    }, []) // Only run on mount

    // Update extensions when settings change
    useEffect(() => {
        if (!editorRef.current) return

        const currentContent = editorRef.current.state.doc.toString()

        editorRef.current.setState(
            EditorState.create({
                doc: currentContent,
                extensions: getExtensions(),
            })
        )
    }, [theme, fontSize, showLineNumbers, wordWrap, vimMode, tabSize, getExtensions])

    // Update content when document changes externally
    useEffect(() => {
        if (!editorRef.current) return

        const currentContent = editorRef.current.state.doc.toString()
        if (currentContent !== content) {
            editorRef.current.dispatch({
                changes: {
                    from: 0,
                    to: currentContent.length,
                    insert: content
                }
            })
        }
    }, [content, currentDocumentId])

    return (
        <div
            ref={containerRef}
            className="h-full w-full overflow-auto focus-within:outline-none"
            style={{ fontSize: `${fontSize}px` }}
        />
    )
}
