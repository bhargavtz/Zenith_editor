
export interface ExportOptions {
    format: 'html' | 'pdf' | 'docx' | 'md'
    template?: string
    includeCSS?: boolean
    includeTOC?: boolean
    pageNumbers?: boolean
    customCSS?: string
    metadata?: DocumentMetadata
}

export interface DocumentMetadata {
    title: string
    author?: string
    date?: string
    description?: string
}

export interface IExporter {
    export(content: string, options: ExportOptions): Promise<Blob>
}

// Placeholder for implementations - to be registered in the engine
import { HTMLExporter } from './html-exporter'
import { PDFExporter } from './pdf-exporter'
import { DOCXExporter } from './docx-exporter'
import { MarkdownExporter } from './markdown-exporter'

export class ExportEngine {
    private htmlExporter: HTMLExporter
    private pdfExporter: PDFExporter
    private docxExporter: DOCXExporter
    private mdExporter: MarkdownExporter

    constructor() {
        this.htmlExporter = new HTMLExporter()
        this.pdfExporter = new PDFExporter()
        this.docxExporter = new DOCXExporter()
        this.mdExporter = new MarkdownExporter()
    }

    async export(content: string, options: ExportOptions): Promise<Blob> {
        switch (options.format) {
            case 'html':
                return this.htmlExporter.export(content, options)
            case 'pdf':
                return this.pdfExporter.export(content, options)
            case 'docx':
                return this.docxExporter.export(content, options)
            case 'md':
                return this.mdExporter.export(content, options)
            default:
                throw new Error(`Unsupported export format: ${options.format}`)
        }
    }
}

export const exportEngine = new ExportEngine()
