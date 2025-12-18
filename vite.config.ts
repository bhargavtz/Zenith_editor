import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        chunkSizeWarningLimit: 600, // Some vendor chunks (CodeMirror langs, html2canvas) are large
        rollupOptions: {
            output: {
                manualChunks: {
                    // Core React
                    'vendor-react': ['react', 'react-dom'],

                    // CodeMirror core
                    'vendor-codemirror': [
                        '@codemirror/state',
                        '@codemirror/view',
                        '@codemirror/commands',
                        '@codemirror/language',
                        '@codemirror/autocomplete',
                        '@codemirror/search',
                        '@codemirror/lint',
                    ],

                    // CodeMirror languages (lazy load candidate)
                    'vendor-codemirror-langs': [
                        '@codemirror/lang-markdown',
                        '@codemirror/language-data',
                    ],

                    // Markdown processing
                    'vendor-markdown': [
                        'unified',
                        'remark-parse',
                        'remark-gfm',
                        'remark-math',
                        'remark-rehype',
                        'rehype-katex',
                        'rehype-highlight',
                        'rehype-stringify',
                        'rehype-sanitize',
                    ],

                    // Export tools (only loaded when exporting)
                    'vendor-export': [
                        'jspdf',
                        'html2canvas',
                        'docx',
                        'file-saver',
                    ],

                    // Math rendering
                    'vendor-katex': ['katex'],

                    // State management
                    'vendor-state': ['zustand', 'dexie'],
                },
            },
        },
    },
})
