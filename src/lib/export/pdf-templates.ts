export interface PDFTemplate {
    id: string
    name: string
    description: string
    category: 'academic' | 'business' | 'technical' | 'resume' | 'article'

    // Layout options
    pageSize: 'a4' | 'letter' | 'legal'
    orientation: 'portrait' | 'landscape'

    // Typography
    fonts: {
        heading: string
        body: string
        code: string
    }

    // Spacing
    margins: {
        top: number
        right: number
        bottom: number
        left: number
    }

    // Header & Footer
    header?: {
        enabled: boolean
        content: (metadata: DocumentMetadata) => string
        height: number
    }

    footer?: {
        enabled: boolean
        showPageNumbers: boolean
        content: (metadata: DocumentMetadata, pageNum: number, totalPages: number) => string
        height: number
    }

    // Styling
    styles: {
        primaryColor: string
        accentColor: string
        headingColor: string
        bodyColor: string
        backgroundColor: string
    }

    // Custom CSS
    customCSS?: string
}

export interface DocumentMetadata {
    title?: string
    author?: string
    date?: string
    description?: string
    organization?: string
}

// Academic Paper Template
export const academicTemplate: PDFTemplate = {
    id: 'academic',
    name: 'Academic Paper',
    description: 'Professional academic paper with title page and citations',
    category: 'academic',
    pageSize: 'a4',
    orientation: 'portrait',

    fonts: {
        heading: 'Georgia, serif',
        body: 'Times New Roman, serif',
        code: 'Courier New, monospace'
    },

    margins: {
        top: 72,
        right: 72,
        bottom: 72,
        left: 72
    },

    header: {
        enabled: true,
        height: 40,
        content: (meta) => meta.title || 'Document'
    },

    footer: {
        enabled: true,
        showPageNumbers: true,
        height: 40,
        content: (meta, page, total) => `${meta.author || ''} | Page ${page} of ${total}`
    },

    styles: {
        primaryColor: '#000000',
        accentColor: '#2563eb',
        headingColor: '#1a1a1a',
        bodyColor: '#333333',
        backgroundColor: '#ffffff'
    },

    customCSS: `
    h1 { 
      text-align: center; 
      border-bottom: 2px solid #2563eb;
      padding-bottom: 0.5em;
      margin-bottom: 1em;
    }
    h2 { 
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 0.3em;
    }
    body {
      line-height: 1.8;
      text-align: justify;
    }
    blockquote {
      border-left: 4px solid #2563eb;
      padding-left: 1em;
      font-style: italic;
    }
  `
}

// Business Report Template
export const businessTemplate: PDFTemplate = {
    id: 'business',
    name: 'Business Report',
    description: 'Clean and professional business document',
    category: 'business',
    pageSize: 'letter',
    orientation: 'portrait',

    fonts: {
        heading: 'Arial, sans-serif',
        body: 'Calibri, sans-serif',
        code: 'Consolas, monospace'
    },

    margins: {
        top: 60,
        right: 60,
        bottom: 60,
        left: 60
    },

    header: {
        enabled: true,
        height: 50,
        content: (meta) => `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <strong>${meta.organization || 'Company Name'}</strong>
        <span>${meta.date || new Date().toLocaleDateString()}</span>
      </div>
    `
    },

    footer: {
        enabled: true,
        showPageNumbers: true,
        height: 30,
        content: (meta, page, total) => `Page ${page} | ${meta.title || 'Report'}`
    },

    styles: {
        primaryColor: '#1e3a8a',
        accentColor: '#3b82f6',
        headingColor: '#1e3a8a',
        bodyColor: '#374151',
        backgroundColor: '#ffffff'
    },

    customCSS: `
    h1 {
      color: #1e3a8a;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 700;
    }
    h2 {
      color: #3b82f6;
      font-weight: 600;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    th {
      background-color: #1e3a8a;
      color: white;
      padding: 0.75em;
    }
    td {
      border: 1px solid #e5e7eb;
      padding: 0.5em;
    }
  `
}

// Technical Documentation Template
export const technicalTemplate: PDFTemplate = {
    id: 'technical',
    name: 'Technical Documentation',
    description: 'Developer-friendly documentation format',
    category: 'technical',
    pageSize: 'a4',
    orientation: 'portrait',

    fonts: {
        heading: 'Segoe UI, sans-serif',
        body: 'Segoe UI, sans-serif',
        code: 'Fira Code, monospace'
    },

    margins: {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    },

    header: {
        enabled: true,
        height: 35,
        content: (meta) => `<code>${meta.title || 'Documentation'}</code>`
    },

    footer: {
        enabled: true,
        showPageNumbers: true,
        height: 30,
        content: (meta, page, total) => `${page}/${total}`
    },

    styles: {
        primaryColor: '#0f172a',
        accentColor: '#06b6d4',
        headingColor: '#0f172a',
        bodyColor: '#334155',
        backgroundColor: '#ffffff'
    },

    customCSS: `
    h1, h2, h3 {
      font-family: 'Segoe UI', sans-serif;
      font-weight: 600;
    }
    h1 {
      border-left: 4px solid #06b6d4;
      padding-left: 0.5em;
    }
    pre {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 1em;
      overflow-x: auto;
    }
    code {
      background-color: #f1f5f9;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-size: 0.9em;
    }
    pre code {
      background-color: transparent;
      padding: 0;
    }
  `
}

// Resume/CV Template
export const resumeTemplate: PDFTemplate = {
    id: 'resume',
    name: 'Resume / CV',
    description: 'Professional resume layout',
    category: 'resume',
    pageSize: 'letter',
    orientation: 'portrait',

    fonts: {
        heading: 'Helvetica, sans-serif',
        body: 'Helvetica, sans-serif',
        code: 'Monaco, monospace'
    },

    margins: {
        top: 40,
        right: 40,
        bottom: 40,
        left: 40
    },

    header: {
        enabled: false,
        height: 0,
        content: () => ''
    },

    footer: {
        enabled: false,
        showPageNumbers: false,
        height: 0,
        content: () => ''
    },

    styles: {
        primaryColor: '#111827',
        accentColor: '#059669',
        headingColor: '#111827',
        bodyColor: '#374151',
        backgroundColor: '#ffffff'
    },

    customCSS: `
    h1 {
      font-size: 2.5em;
      margin-bottom: 0.2em;
      color: #111827;
    }
    h2 {
      color: #059669;
      font-size: 1.3em;
      border-bottom: 2px solid #059669;
      padding-bottom: 0.3em;
      margin-top: 1em;
    }
    h3 {
      font-size: 1.1em;
      margin-bottom: 0.3em;
    }
    ul {
      margin-left: 1.5em;
    }
    a {
      color: #059669;
      text-decoration: none;
    }
  `
}

// Article/Blog Template
export const articleTemplate: PDFTemplate = {
    id: 'article',
    name: 'Article / Blog Post',
    description: 'Clean reading experience for articles',
    category: 'article',
    pageSize: 'a4',
    orientation: 'portrait',

    fonts: {
        heading: 'Inter, sans-serif',
        body: 'Charter, Georgia, serif',
        code: 'Menlo, monospace'
    },

    margins: {
        top: 80,
        right: 80,
        bottom: 80,
        left: 80
    },

    header: {
        enabled: false,
        height: 0,
        content: () => ''
    },

    footer: {
        enabled: true,
        showPageNumbers: true,
        height: 30,
        content: (meta, page) => `${page}`
    },

    styles: {
        primaryColor: '#18181b',
        accentColor: '#ef4444',
        headingColor: '#18181b',
        bodyColor: '#3f3f46',
        backgroundColor: '#ffffff'
    },

    customCSS: `
    h1 {
      font-size: 2.8em;
      line-height: 1.2;
      margin-bottom: 0.5em;
      font-weight: 800;
    }
    h2 {
      font-size: 1.8em;
      margin-top: 1.5em;
      font-weight: 700;
    }
    body {
      font-size: 11pt;
      line-height: 1.7;
    }
    p {
      margin-bottom: 1em;
    }
    blockquote {
      border-left: 3px solid #ef4444;
      padding-left: 1.5em;
      margin-left: 0;
      font-size: 1.1em;
      color: #52525b;
    }
  `
}

// Template registry
export const pdfTemplates: PDFTemplate[] = [
    academicTemplate,
    businessTemplate,
    technicalTemplate,
    resumeTemplate,
    articleTemplate
]

export function getTemplateById(id: string): PDFTemplate | undefined {
    return pdfTemplates.find(t => t.id === id)
}

export function getTemplatesByCategory(category: string): PDFTemplate[] {
    return pdfTemplates.filter(t => t.category === category)
}
