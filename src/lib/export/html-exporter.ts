import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'
import rehypeSanitize from 'rehype-sanitize'
import { ExportOptions } from './export-engine'
import { TOCGenerator } from './toc-generator'

export class HTMLExporter {
  private tocGenerator: TOCGenerator

  constructor() {
    this.tocGenerator = new TOCGenerator()
  }

  async export(content: string, options: ExportOptions): Promise<Blob> {
    const processor = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkRehype, { allowDangerousHtml: false })
      .use(rehypeSanitize)
      .use(rehypeKatex)
      .use(rehypeHighlight)
      .use(rehypeStringify)

    const result = await processor.process(content)
    let htmlContent = String(result)

    let tocHTML = ''
    if (options.includeTOC) {
      const toc = this.tocGenerator.generate(content)
      tocHTML = `
        <div class="toc">
          <h2>Table of Contents</h2>
          ${this.tocGenerator.toHTML(toc)}
        </div>
      `
    }

    const fullDoc = this.buildHTML(htmlContent, tocHTML, options)
    return new Blob([fullDoc], { type: 'text/html' })
  }

  private buildHTML(content: string, toc: string, options: ExportOptions): string {
    const title = options.metadata?.title || 'Document'

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css">
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
      }
      @media (prefers-color-scheme: dark) {
        body {
          background-color: #0d1117;
          color: #c9d1d9;
        }
        a { color: #58a6ff; }
      }
      img { max-width: 100%; }
      pre { padding: 1rem; border-radius: 0.5rem; overflow-x: auto; }
      blockquote { border-left: 4px solid #eee; padding-left: 1rem; color: #666; }
      table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
      th, td { border: 1px solid #ddd; padding: 0.5rem; text-align: left; }
      @media (prefers-color-scheme: dark) {
        blockquote { border-left-color: #30363d; color: #8b949e; }
        th, td { border-color: #30363d; }
      }
      .toc ul { list-style: none; padding-left: 0; }
      .toc li { margin-bottom: 0.25rem; }
      .toc ul ul { padding-left: 1.5rem; }
      ${options.customCSS || ''}
      
      /* Template Styles */
      ${this.getTemplateCSS(options.template)}
    </style>
</head>
<body>
    ${options.metadata?.title ? `<h1>${options.metadata.title}</h1>` : ''}
    ${options.metadata?.author ? `<p class="author">By ${options.metadata.author}</p>` : ''}
    ${toc}
    <div class="content">
        ${content}
    </div>
</body>
</html>`
  }

  private getTemplateCSS(template?: string): string {
    switch (template) {
      case 'academic':
        return `
                body { font-family: "Georgia", "Times New Roman", serif; line-height: 1.8; text-align: justify; }
                h1, h2 { border-bottom: 1px solid #ccc; padding-bottom: 0.5rem; }
            `
      case 'modern':
        return `
                body { font-family: "Inter", -apple-system, sans-serif; }
                h1 { font-weight: 800; letter-spacing: -1px; color: #111; }
                @media (prefers-color-scheme: dark) { h1 { color: #fff; } }
            `
      case 'technical':
        return `
                body { font-family: "Segoe UI", Roboto, sans-serif; max-width: 900px; }
                pre { border: 1px solid #e1e4e8; border-radius: 6px; }
                h1, h2 { text-transform: uppercase; letter-spacing: 1px; }
            `
      case 'minimalist':
        return `
                body { max-width: 650px; font-family: system-ui, sans-serif; color: #444; }
                h1 { font-weight: 300; font-size: 2.5rem; margin-bottom: 2rem; }
                @media (prefers-color-scheme: dark) { body { color: #bbb; } }
            `
      case 'typewriter':
        return `
                body { font-family: "Courier New", monospace; max-width: 700px; }
                h1, h2, h3 { text-decoration: underline; }
            `
      default:
        return ''
    }
  }
}
