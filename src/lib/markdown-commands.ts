import { EditorView } from '@codemirror/view'

/**
 * Markdown formatting commands for CodeMirror
 */
export const markdownCommands = {
    toggleBold: (view: EditorView) => {
        const { from, to } = view.state.selection.main
        const selectedText = view.state.doc.sliceString(from, to)
        const wrapped = `**${selectedText}**`
        view.dispatch({
            changes: { from, to, insert: wrapped },
            selection: { anchor: from + 2, head: to + 2 }
        })
        return true
    },

    toggleItalic: (view: EditorView) => {
        const { from, to } = view.state.selection.main
        const selectedText = view.state.doc.sliceString(from, to)
        const wrapped = `*${selectedText}*`
        view.dispatch({
            changes: { from, to, insert: wrapped },
            selection: { anchor: from + 1, head: to + 1 }
        })
        return true
    },

    toggleStrikethrough: (view: EditorView) => {
        const { from, to } = view.state.selection.main
        const selectedText = view.state.doc.sliceString(from, to)
        const wrapped = `~~${selectedText}~~`
        view.dispatch({
            changes: { from, to, insert: wrapped },
            selection: { anchor: from + 2, head: to + 2 }
        })
        return true
    },

    toggleCode: (view: EditorView) => {
        const { from, to } = view.state.selection.main
        const selectedText = view.state.doc.sliceString(from, to)
        const wrapped = `\`${selectedText}\``
        view.dispatch({
            changes: { from, to, insert: wrapped },
            selection: { anchor: from + 1, head: to + 1 }
        })
        return true
    },

    insertHeading: (view: EditorView, level: number) => {
        const { from } = view.state.selection.main
        const line = view.state.doc.lineAt(from)
        const lineStart = line.from
        const prefix = '#'.repeat(level) + ' '

        view.dispatch({
            changes: { from: lineStart, to: lineStart, insert: prefix },
            selection: { anchor: from + prefix.length }
        })
        return true
    },

    insertLink: (view: EditorView) => {
        const { from, to } = view.state.selection.main
        const selectedText = view.state.doc.sliceString(from, to)
        const linkText = selectedText || 'link text'
        const wrapped = `[${linkText}](url)`

        view.dispatch({
            changes: { from, to, insert: wrapped },
            selection: { anchor: from + linkText.length + 3, head: from + linkText.length + 6 }
        })
        return true
    },

    insertImage: (view: EditorView) => {
        const { from, to } = view.state.selection.main
        const selectedText = view.state.doc.sliceString(from, to)
        const altText = selectedText || 'alt text'
        const wrapped = `![${altText}](url)`

        view.dispatch({
            changes: { from, to, insert: wrapped },
            selection: { anchor: from + altText.length + 4, head: from + altText.length + 7 }
        })
        return true
    },

    insertUnorderedList: (view: EditorView) => {
        const { from } = view.state.selection.main
        const line = view.state.doc.lineAt(from)
        const lineStart = line.from
        const prefix = '- '

        view.dispatch({
            changes: { from: lineStart, to: lineStart, insert: prefix },
            selection: { anchor: from + prefix.length }
        })
        return true
    },

    insertOrderedList: (view: EditorView) => {
        const { from } = view.state.selection.main
        const line = view.state.doc.lineAt(from)
        const lineStart = line.from
        const prefix = '1. '

        view.dispatch({
            changes: { from: lineStart, to: lineStart, insert: prefix },
            selection: { anchor: from + prefix.length }
        })
        return true
    },

    insertTaskList: (view: EditorView) => {
        const { from } = view.state.selection.main
        const line = view.state.doc.lineAt(from)
        const lineStart = line.from
        const prefix = '- [ ] '

        view.dispatch({
            changes: { from: lineStart, to: lineStart, insert: prefix },
            selection: { anchor: from + prefix.length }
        })
        return true
    },

    insertBlockquote: (view: EditorView) => {
        const { from } = view.state.selection.main
        const line = view.state.doc.lineAt(from)
        const lineStart = line.from
        const prefix = '> '

        view.dispatch({
            changes: { from: lineStart, to: lineStart, insert: prefix },
            selection: { anchor: from + prefix.length }
        })
        return true
    },

    insertHorizontalRule: (view: EditorView) => {
        const { from } = view.state.selection.main
        const line = view.state.doc.lineAt(from)
        const lineEnd = line.to
        const hr = '\n\n---\n\n'

        view.dispatch({
            changes: { from: lineEnd, to: lineEnd, insert: hr },
            selection: { anchor: lineEnd + hr.length }
        })
        return true
    }
}

/**
 * Get editor view from window
 * This is a helper for the toolbar to access the editor instance
 */
export function getEditorView(): EditorView | null {
    // The editor view will be stored in a global context
    // This will be set from the Editor component
    return (window as any).__zenithEditorView || null
}
