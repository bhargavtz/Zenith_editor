import { unified } from 'unified'
import remarkParse from 'remark-parse'
import { visit } from 'unist-util-visit'

export interface TOCEntry {
    level: number
    text: string
    id: string
    children: TOCEntry[]
}

export class TOCGenerator {
    generate(markdown: string): TOCEntry[] {
        const ast = unified().use(remarkParse).parse(markdown)
        const headings: TOCEntry[] = []

        visit(ast, 'heading', (node: any) => {
            const text = node.children
                .filter((c: any) => c.type === 'text' || c.type === 'inlineCode')
                .map((c: any) => c.value)
                .join('')

            const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

            headings.push({
                level: node.depth,
                text,
                id: slug,
                children: []
            })
        })

        return this.buildHierarchy(headings)
    }

    private buildHierarchy(headings: TOCEntry[]): TOCEntry[] {
        const root: TOCEntry[] = []
        const stack: TOCEntry[] = []

        headings.forEach(heading => {
            // Logic to nest headings properly
            // If stack is empty, push to root
            // If current level > stack top level, it's a child of stack top
            // If current level <= stack top level, pop stack until we find a parent or stack empty

            while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
                stack.pop()
            }

            if (stack.length === 0) {
                root.push(heading)
            } else {
                stack[stack.length - 1].children.push(heading)
            }

            stack.push(heading)
        })

        return root
    }

    toHTML(toc: TOCEntry[]): string {
        if (toc.length === 0) return ''

        let html = '<ul>'
        toc.forEach(entry => {
            html += `<li><a href="#${entry.id}">${entry.text}</a>`
            if (entry.children.length > 0) {
                html += this.toHTML(entry.children)
            }
            html += '</li>'
        })
        html += '</ul>'
        return html
    }
}
