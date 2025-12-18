import { useMemo, useRef, useEffect } from 'react'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import '@/styles/preview.css'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github-dark.css'

interface PreviewProps {
    content: string
    scrollProgress?: number
}

export function Preview({ content, scrollProgress }: PreviewProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (containerRef.current && scrollProgress !== undefined) {
            const { scrollHeight, clientHeight } = containerRef.current
            const maxScroll = scrollHeight - clientHeight
            containerRef.current.scrollTop = maxScroll * scrollProgress
        }
    }, [scrollProgress])

    const html = useMemo(() => {
        try {
            const processor = unified()
                .use(remarkParse)
                .use(remarkGfm)
                .use(remarkMath)
                .use(remarkRehype, { allowDangerousHtml: true })
                .use(rehypeSanitize, {
                    ...defaultSchema,
                    attributes: {
                        ...defaultSchema.attributes,
                        code: [
                            ...(defaultSchema.attributes?.code || []),
                            ['className', /^language-./],
                        ],
                        span: [
                            ...(defaultSchema.attributes?.span || []),
                            ['className', /^(hljs|katex)/],
                            ['style'],
                        ],
                        div: [
                            ...(defaultSchema.attributes?.div || []),
                            ['className', /^(katex|math)/],
                        ],
                    },
                    tagNames: [
                        ...(defaultSchema.tagNames || []),
                        'math',
                        'semantics',
                        'mrow',
                        'mi',
                        'mo',
                        'mn',
                        'msup',
                        'msub',
                        'mfrac',
                        'munder',
                        'mover',
                        'msqrt',
                        'mtable',
                        'mtr',
                        'mtd',
                        'annotation',
                    ],
                })
                .use(rehypeKatex)
                .use(rehypeHighlight, { detect: true, ignoreMissing: true })
                .use(rehypeStringify)

            const result = processor.processSync(content)
            return String(result)
        } catch (error) {
            console.error('Preview rendering error:', error)
            return '<p class="text-destructive">Error rendering preview</p>'
        }
    }, [content])

    return (
        <div className="h-full overflow-auto" ref={containerRef}>
            <div className="preview-header flex items-center justify-between border-b border-border px-4 py-2">
                <span className="text-sm font-medium text-muted-foreground">Preview</span>
            </div>
            <article
                className="preview-content prose prose-slate dark:prose-invert max-w-none p-6"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </div>
    )
}
