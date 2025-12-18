import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { ExportOptions } from './export-engine'
import { HTMLExporter } from './html-exporter'
import { PDFTemplate, getTemplateById, academicTemplate } from './pdf-templates'

export class PDFExporter {
    private htmlExporter: HTMLExporter

    constructor() {
        this.htmlExporter = new HTMLExporter()
    }

    async export(content: string, options: ExportOptions): Promise<Blob> {
        // Get template (default to academic if none specified)
        const template = options.template
            ? getTemplateById(options.template) || academicTemplate
            : academicTemplate

        // Generate styled HTML with template
        const htmlBlob = await this.htmlExporter.export(content, {
            ...options,
            customCSS: this.generatePDFCSS(template, options.customCSS)
        })
        const htmlText = await htmlBlob.text()

        // Create container for rendering
        const container = document.createElement('div')
        container.style.position = 'fixed'
        container.style.left = '-10000px'
        container.style.top = '0'
        container.style.width = this.getPageWidth(template.pageSize) + 'px'
        container.style.backgroundColor = template.styles.backgroundColor
        container.innerHTML = htmlText
        document.body.appendChild(container)

        // Wait for fonts and images to load
        await this.waitForResources(container)

        try {
            // Calculate page dimensions
            const pageWidth = this.getPageWidth(template.pageSize)
            const pageHeight = this.getPageHeight(template.pageSize)
            const pdfWidth = template.orientation === 'portrait' ? pageWidth : pageHeight
            const pdfHeight = template.orientation === 'portrait' ? pageHeight : pageWidth

            // Create PDF
            const pdf = new jsPDF({
                orientation: template.orientation,
                unit: 'pt',
                format: [pdfWidth, pdfHeight]
            })

            // Calculate content area (excluding margins)
            const contentWidth = pdfWidth - template.margins.left - template.margins.right
            const contentHeight = pdfHeight - template.margins.top - template.margins.bottom

            // Page tracking
            let currentY = template.margins.top
            let pageCount = 1
            let firstPage = true

            // Split content into pages
            const contentElement = container.querySelector('.content') || container
            const elements = Array.from(contentElement.children) as HTMLElement[]

            for (const element of elements) {
                const elementHeight = element.offsetHeight

                // Check if we need a new page
                if (currentY + elementHeight > pdfHeight - template.margins.bottom && !firstPage) {
                    // Add footer to current page
                    if (template.footer?.enabled) {
                        this.addFooter(pdf, template, options.metadata, pageCount, pdfWidth, pdfHeight)
                    }

                    pdf.addPage()
                    pageCount++
                    currentY = template.margins.top

                    // Add header to new page
                    if (template.header?.enabled) {
                        this.addHeader(pdf, template, options.metadata, pdfWidth)
                        currentY += template.header.height
                    }
                }

                // Render element to canvas
                const canvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    backgroundColor: template.styles.backgroundColor
                })

                const imgData = canvas.toDataURL('image/png')
                const imgWidth = contentWidth
                const imgHeight = (canvas.height * contentWidth) / canvas.width

                // Add image to PDF
                pdf.addImage(imgData, 'PNG', template.margins.left, currentY, imgWidth, imgHeight)

                currentY += imgHeight + 10 // Add small spacing
                firstPage = false
            }

            // Add footer to last page
            if (template.footer?.enabled) {
                this.addFooter(pdf, template, options.metadata, pageCount, pdfWidth, pdfHeight)
            }

            // Generate blob
            const blob = pdf.output('blob')
            document.body.removeChild(container)
            return blob

        } catch (error) {
            document.body.removeChild(container)
            throw error
        }
    }

    private generatePDFCSS(template: PDFTemplate, customCSS?: string): string {
        return `
            * {
                box-sizing: border-box;
            }
            
            body {
                font-family: ${template.fonts.body};
                color: ${template.styles.bodyColor};
                background-color: ${template.styles.backgroundColor};
                line-height: 1.6;
                margin: 0;
                padding: ${template.margins.top}px ${template.margins.right}px ${template.margins.bottom}px ${template.margins.left}px;
            }
            
            h1, h2, h3, h4, h5, h6 {
                font-family: ${template.fonts.heading};
                color: ${template.styles.headingColor};
                margin-top: 1em;
                margin-bottom: 0.5em;
            }
            
            h1 { font-size: 2em; }
            h2 { font-size: 1.5em; }
            h3 { font-size: 1.17em; }
            
            code, pre {
                font-family: ${template.fonts.code};
            }
            
            a {
                color: ${template.styles.accentColor};
            }
            
            ${template.customCSS || ''}
            ${customCSS || ''}
        `
    }

    private addHeader(pdf: jsPDF, template: PDFTemplate, metadata: any, pageWidth: number) {
        if (!template.header) return

        const headerContent = template.header.content(metadata || {})
        pdf.setFontSize(10)
        pdf.setTextColor(100, 100, 100)

        // Simple text header (can be enhanced with HTML rendering)
        const lines = pdf.splitTextToSize(headerContent.replace(/<[^>]*>/g, ''), pageWidth - template.margins.left - template.margins.right)
        pdf.text(lines, template.margins.left, template.margins.top - 10)
    }

    private addFooter(pdf: jsPDF, template: PDFTemplate, metadata: any, pageNum: number, pageWidth: number, pageHeight: number) {
        if (!template.footer) return

        const footerContent = template.footer.content(metadata || {}, pageNum, pageNum) // Total pages would need tracking
        pdf.setFontSize(9)
        pdf.setTextColor(100, 100, 100)

        if (template.footer.showPageNumbers) {
            pdf.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 20, { align: 'center' })
        }

        // Additional footer content
        const cleanContent = footerContent.replace(/<[^>]*>/g, '')
        if (cleanContent && !cleanContent.includes('Page')) {
            pdf.text(cleanContent, template.margins.left, pageHeight - 20)
        }
    }

    private async waitForResources(container: HTMLElement): Promise<void> {
        // Wait for images
        const images = Array.from(container.querySelectorAll('img'))
        await Promise.all(
            images.map(img => {
                if (img.complete) return Promise.resolve()
                return new Promise((resolve) => {
                    img.onload = () => resolve(null)
                    img.onerror = () => resolve(null)
                })
            })
        )

        // Wait for fonts
        if (document.fonts) {
            await document.fonts.ready
        }

        // Additional buffer for rendering
        await new Promise(resolve => setTimeout(resolve, 500))
    }

    private getPageWidth(size: 'a4' | 'letter' | 'legal'): number {
        switch (size) {
            case 'a4': return 595
            case 'letter': return 612
            case 'legal': return 612
            default: return 595
        }
    }

    private getPageHeight(size: 'a4' | 'letter' | 'legal'): number {
        switch (size) {
            case 'a4': return 842
            case 'letter': return 792
            case 'legal': return 1008
            default: return 842
        }
    }
}
