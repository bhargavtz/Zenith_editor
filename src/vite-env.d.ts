/// <reference types="vite/client" />

// File System Access API types
interface FilePickerOptions {
    types?: {
        description: string
        accept: Record<string, string[]>
    }[]
    excludeAcceptAllOption?: boolean
    multiple?: boolean
}

interface SaveFilePickerOptions {
    suggestedName?: string
    types?: {
        description: string
        accept: Record<string, string[]>
    }[]
}

interface FileSystemFileHandle {
    getFile(): Promise<File>
    createWritable(): Promise<FileSystemWritableFileStream>
    name: string
}

interface FileSystemWritableFileStream extends WritableStream {
    write(data: string | BufferSource | Blob): Promise<void>
    close(): Promise<void>
}

interface Window {
    showOpenFilePicker(options?: FilePickerOptions): Promise<FileSystemFileHandle[]>
    showSaveFilePicker(options?: SaveFilePickerOptions): Promise<FileSystemFileHandle>
}

interface ImportMetaEnv {
    readonly VITE_OPENROUTER_API_KEY: string
    readonly VITE_AI_MODEL?: string
    readonly VITE_AI_MAX_TOKENS?: string
    readonly VITE_ANTHROPIC_API_KEY?: string
    readonly VITE_OPENAI_API_KEY?: string
    readonly VITE_SUPABASE_URL?: string
    readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
