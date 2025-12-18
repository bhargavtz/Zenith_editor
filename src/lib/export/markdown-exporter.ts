import { ExportOptions } from './export-engine'

export class MarkdownExporter {
    async export(content: string, options: ExportOptions): Promise<Blob> {
        let output = content

        // Inject metadata as frontmatter if provided
        if (options.metadata) {
            const frontmatter = [
                '---',
                `title: "${options.metadata.title}"`,
                options.metadata.author ? `author: "${options.metadata.author}"` : null,
                options.metadata.date ? `date: "${options.metadata.date}"` : null,
                options.metadata.description ? `description: "${options.metadata.description}"` : null,
                '---',
                ''
            ].filter(Boolean).join('\n')

            output = frontmatter + output
        }

        return new Blob([output], { type: 'text/markdown' })
    }
}
