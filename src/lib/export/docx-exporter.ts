import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import { ExportOptions } from './export-engine'

export class DOCXExporter {
    async export(content: string, options: ExportOptions): Promise<Blob> {
        const ast = unified().use(remarkParse).parse(content)
        // @ts-ignore - ast.children exists on Root
        const children = this.transformNodes(ast.children)

        const doc = new Document({
            title: options.metadata?.title,
            description: options.metadata?.description,
            sections: [{
                properties: {},
                children: children
            }]
        })

        return await Packer.toBlob(doc)
    }

    private transformNodes(nodes: any[]): Paragraph[] {
        const docxNodes: Paragraph[] = []

        for (const node of nodes) {
            switch (node.type) {
                case 'heading':
                    docxNodes.push(new Paragraph({
                        heading: this.getHeadingLevel(node.depth),
                        children: this.getRuns(node.children)
                    }))
                    break
                case 'paragraph':
                    docxNodes.push(new Paragraph({
                        children: this.getRuns(node.children)
                    }))
                    break
                case 'list':
                    // Simple list handling - flatten for now or map
                    node.children.forEach((listItem: any) => {
                        listItem.children.forEach((p: any) => {
                            docxNodes.push(new Paragraph({
                                children: this.getRuns(p.children),
                                bullet: { level: 0 } // Simple bullet
                            }))
                        })
                    })
                    break
                case 'code':
                    docxNodes.push(new Paragraph({
                        children: [new TextRun({
                            text: node.value,
                            font: 'Courier New'
                        })]
                    }))
                    break
                case 'blockquote':
                    // Recurse? blockquote contains paragraphs
                    node.children.forEach((child: any) => {
                        docxNodes.push(...this.transformNodes([child]))
                    })
                    break
            }
        }
        return docxNodes
    }

    private getHeadingLevel(depth: number) {
        switch (depth) {
            case 1: return HeadingLevel.HEADING_1
            case 2: return HeadingLevel.HEADING_2
            case 3: return HeadingLevel.HEADING_3
            case 4: return HeadingLevel.HEADING_4
            case 5: return HeadingLevel.HEADING_5
            case 6: return HeadingLevel.HEADING_6
            default: return HeadingLevel.HEADING_1
        }
    }

    private getRuns(nodes: any[]): TextRun[] {
        const runs: TextRun[] = []
        for (const node of nodes) {
            if (node.type === 'text') {
                runs.push(new TextRun({ text: node.value }))
            } else if (node.type === 'emphasis') {
                runs.push(new TextRun({ text: this.getText(node), italics: true }))
            } else if (node.type === 'strong') {
                runs.push(new TextRun({ text: this.getText(node), bold: true }))
            } else if (node.type === 'inlineCode') {
                runs.push(new TextRun({ text: node.value, font: "Courier New" }))
            } else if (node.type === 'link') {
                // For now just text
                runs.push(new TextRun({ text: this.getText(node), color: "0563C1", underline: {} }))
            }
        }
        return runs
    }

    private getText(node: any): string {
        return (node.children || []).map((n: any) => n.value || this.getText(n)).join('')
    }
}
