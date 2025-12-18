import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Document {
    id: string
    name: string
    content: string
    createdAt: Date
    updatedAt: Date
    pinned: boolean
    tags: string[]
}

export interface DocumentsState {
    documents: Document[]
    recentDocuments: string[] // Document IDs
    currentDocumentId: string | null

    // Actions
    addDocument: (doc: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => string
    updateDocument: (id: string, updates: Partial<Document>) => void
    deleteDocument: (id: string) => void
    setCurrentDocument: (id: string | null) => void
    pinDocument: (id: string) => void
    unpinDocument: (id: string) => void
    addToRecent: (id: string) => void
    getDocument: (id: string) => Document | undefined
}

const generateId = () => Math.random().toString(36).substring(2, 15)

export const useDocumentsStore = create<DocumentsState>()(
    persist(
        (set, get) => ({
            documents: [],
            recentDocuments: [],
            currentDocumentId: null,

            addDocument: (doc) => {
                const id = generateId()
                const now = new Date()
                const newDoc: Document = {
                    ...doc,
                    id,
                    createdAt: now,
                    updatedAt: now,
                }
                set((state) => ({
                    documents: [...state.documents, newDoc],
                    currentDocumentId: id,
                }))
                get().addToRecent(id)
                return id
            },

            updateDocument: (id, updates) => {
                set((state) => ({
                    documents: state.documents.map((doc) =>
                        doc.id === id
                            ? { ...doc, ...updates, updatedAt: new Date() }
                            : doc
                    ),
                }))
            },

            deleteDocument: (id) => {
                set((state) => ({
                    documents: state.documents.filter((doc) => doc.id !== id),
                    recentDocuments: state.recentDocuments.filter((docId) => docId !== id),
                    currentDocumentId:
                        state.currentDocumentId === id ? null : state.currentDocumentId,
                }))
            },

            setCurrentDocument: (id) => {
                set({ currentDocumentId: id })
                if (id) {
                    get().addToRecent(id)
                }
            },

            pinDocument: (id) => {
                set((state) => ({
                    documents: state.documents.map((doc) =>
                        doc.id === id ? { ...doc, pinned: true } : doc
                    ),
                }))
            },

            unpinDocument: (id) => {
                set((state) => ({
                    documents: state.documents.map((doc) =>
                        doc.id === id ? { ...doc, pinned: false } : doc
                    ),
                }))
            },

            addToRecent: (id) => {
                set((state) => {
                    const filtered = state.recentDocuments.filter((docId) => docId !== id)
                    return {
                        recentDocuments: [id, ...filtered].slice(0, 20), // Keep last 20
                    }
                })
            },

            getDocument: (id) => {
                return get().documents.find((doc) => doc.id === id)
            },
        }),
        {
            name: 'zenith-documents-storage',
        }
    )
)
