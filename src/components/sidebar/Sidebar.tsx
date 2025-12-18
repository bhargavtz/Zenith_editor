import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FileText,
    Folder,
    ChevronRight,
    ChevronDown,
    Pin,
    Clock,
    Tag,
    Plus,
    Search,
    X
} from 'lucide-react'
import { useDocumentsStore, Document } from '@/stores/documents'
import { cn } from '@/lib/utils'

interface SidebarProps {
    isOpen: boolean
    onToggle: () => void
}

interface FileItemProps {
    document: Document
    isActive: boolean
    onSelect: () => void
}

function FileItem({ document, isActive, onSelect }: FileItemProps) {
    return (
        <button
            onClick={onSelect}
            className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                "hover:bg-muted",
                isActive && "bg-primary/10 text-primary"
            )}
        >
            <FileText className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{document.name}</span>
            {document.pinned && (
                <Pin className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
            )}
        </button>
    )
}

interface CollapsibleSectionProps {
    title: string
    icon: React.ReactNode
    children: React.ReactNode
    defaultOpen?: boolean
}

function CollapsibleSection({ title, icon, children, defaultOpen = true }: CollapsibleSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    return (
        <div className="mb-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center gap-1 px-2 py-1 text-xs font-medium uppercase text-muted-foreground hover:text-foreground"
            >
                {isOpen ? (
                    <ChevronDown className="h-3 w-3" />
                ) : (
                    <ChevronRight className="h-3 w-3" />
                )}
                {icon}
                <span>{title}</span>
            </button>
            {isOpen && <div className="mt-1">{children}</div>}
        </div>
    )
}

export function Sidebar({ isOpen, onToggle: _onToggle }: SidebarProps) {
    const { documents, recentDocuments, currentDocumentId, setCurrentDocument, getDocument } = useDocumentsStore()
    const [searchQuery, setSearchQuery] = useState('')

    const pinnedDocs = documents.filter(doc => doc.pinned)
    const recentDocs = recentDocuments
        .map(id => getDocument(id))
        .filter((doc): doc is Document => doc !== undefined)
        .slice(0, 10)

    const allTags = [...new Set(documents.flatMap(doc => doc.tags))]

    const filteredDocs = searchQuery
        ? documents.filter(doc =>
            doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : []

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.aside
                    initial={{ x: -280, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -280, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="flex h-full w-64 flex-col border-r border-border bg-card"
                >
                    {/* Search */}
                    <div className="border-b border-border p-2">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search documents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-md border border-input bg-background py-1.5 pl-8 pr-8 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-2">
                        {/* Search Results */}
                        {searchQuery && (
                            <CollapsibleSection
                                title="Search Results"
                                icon={<Search className="h-3 w-3" />}
                            >
                                {filteredDocs.length > 0 ? (
                                    filteredDocs.map(doc => (
                                        <FileItem
                                            key={doc.id}
                                            document={doc}
                                            isActive={doc.id === currentDocumentId}
                                            onSelect={() => setCurrentDocument(doc.id)}
                                        />
                                    ))
                                ) : (
                                    <p className="px-2 py-1 text-xs text-muted-foreground">
                                        No documents found
                                    </p>
                                )}
                            </CollapsibleSection>
                        )}

                        {!searchQuery && (
                            <>
                                {/* Pinned */}
                                {pinnedDocs.length > 0 && (
                                    <CollapsibleSection
                                        title="Pinned"
                                        icon={<Pin className="h-3 w-3" />}
                                    >
                                        {pinnedDocs.map(doc => (
                                            <FileItem
                                                key={doc.id}
                                                document={doc}
                                                isActive={doc.id === currentDocumentId}
                                                onSelect={() => setCurrentDocument(doc.id)}
                                            />
                                        ))}
                                    </CollapsibleSection>
                                )}

                                {/* Recent */}
                                <CollapsibleSection
                                    title="Recent"
                                    icon={<Clock className="h-3 w-3" />}
                                >
                                    {recentDocs.length > 0 ? (
                                        recentDocs.map(doc => (
                                            <FileItem
                                                key={doc.id}
                                                document={doc}
                                                isActive={doc.id === currentDocumentId}
                                                onSelect={() => setCurrentDocument(doc.id)}
                                            />
                                        ))
                                    ) : (
                                        <p className="px-2 py-1 text-xs text-muted-foreground">
                                            No recent documents
                                        </p>
                                    )}
                                </CollapsibleSection>

                                {/* All Documents */}
                                <CollapsibleSection
                                    title="All Documents"
                                    icon={<Folder className="h-3 w-3" />}
                                    defaultOpen={false}
                                >
                                    {documents.length > 0 ? (
                                        documents.map(doc => (
                                            <FileItem
                                                key={doc.id}
                                                document={doc}
                                                isActive={doc.id === currentDocumentId}
                                                onSelect={() => setCurrentDocument(doc.id)}
                                            />
                                        ))
                                    ) : (
                                        <p className="px-2 py-1 text-xs text-muted-foreground">
                                            No documents yet
                                        </p>
                                    )}
                                </CollapsibleSection>

                                {/* Tags */}
                                {allTags.length > 0 && (
                                    <CollapsibleSection
                                        title="Tags"
                                        icon={<Tag className="h-3 w-3" />}
                                        defaultOpen={false}
                                    >
                                        <div className="flex flex-wrap gap-1 px-2">
                                            {allTags.map(tag => (
                                                <span
                                                    key={tag}
                                                    className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </CollapsibleSection>
                                )}
                            </>
                        )}
                    </div>

                    {/* New Document Button */}
                    <div className="border-t border-border p-2">
                        <button
                            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                        >
                            <Plus className="h-4 w-4" />
                            New Document
                        </button>
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    )
}
