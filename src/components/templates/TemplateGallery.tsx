import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, Search } from 'lucide-react'
import { documentTemplates, templateCategories, type DocumentTemplate } from '@/lib/templates/document-templates'
import { useEditorStore } from '@/stores/editor'
import { cn } from '@/lib/utils'

interface TemplateGalleryProps {
    isOpen: boolean
    onClose: () => void
}

export function TemplateGallery({ isOpen, onClose }: TemplateGalleryProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const { setContent, setFileName, setIsDirty } = useEditorStore()

    const filteredTemplates = documentTemplates.filter(template => {
        const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
        const matchesSearch = searchQuery === '' ||
            template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

        return matchesCategory && matchesSearch
    })

    const handleSelectTemplate = (template: DocumentTemplate) => {
        setContent(template.content)
        setFileName(`${template.name}.md`)
        setIsDirty(true)
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="template-gallery-title"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="relative w-full max-w-4xl max-h-[85vh] rounded-xl bg-background shadow-2xl ring-1 ring-border overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-border p-4 shrink-0">
                            <div>
                                <h2 id="template-gallery-title" className="text-xl font-semibold">
                                    Choose a Template
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Start with a professional template and customize it
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-lg p-2 hover:bg-muted transition-colors"
                                aria-label="Close template gallery"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Search and Filters */}
                        <div className="p-4 border-b border-border space-y-4 shrink-0">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search templates..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>

                            {/* Category Filters */}
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                        selectedCategory === 'all'
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted hover:bg-muted/80"
                                    )}
                                >
                                    All Templates
                                </button>
                                {templateCategories.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                                            selectedCategory === category.id
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted hover:bg-muted/80"
                                        )}
                                    >
                                        <span>{category.icon}</span>
                                        <span>{category.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Templates Grid */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {filteredTemplates.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No templates found</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Try adjusting your search or filters
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredTemplates.map(template => (
                                        <motion.button
                                            key={template.id}
                                            onClick={() => handleSelectTemplate(template)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="group relative p-5 rounded-lg border-2 border-border hover:border-primary bg-card text-left transition-all"
                                        >
                                            {/* Category Badge */}
                                            <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-muted text-xs font-medium">
                                                {templateCategories.find(c => c.id === template.category)?.icon}
                                            </div>

                                            {/* Content */}
                                            <div className="space-y-3">
                                                <div>
                                                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                                        {template.name}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                        {template.description}
                                                    </p>
                                                </div>

                                                {/* Tags */}
                                                <div className="flex flex-wrap gap-1">
                                                    {template.tags.slice(0, 3).map(tag => (
                                                        <span
                                                            key={tag}
                                                            className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Use Button */}
                                                <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-sm font-medium text-primary">
                                                        Use this template →
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-border p-4 bg-muted/20 shrink-0">
                            <p className="text-sm text-muted-foreground text-center">
                                <strong>{filteredTemplates.length}</strong> template{filteredTemplates.length !== 1 ? 's' : ''} available
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
