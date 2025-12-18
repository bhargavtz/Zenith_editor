import { create } from 'zustand'
import { openrouter, OpenRouterMessage } from '@/lib/ai/openrouter'
import { executeSlashCommand, SlashCommand } from '@/lib/ai/slash-commands'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

interface AIState {
    // UI State
    panelOpen: boolean
    isProcessing: boolean
    currentSuggestion: string | null

    // Conversation
    conversationHistory: Message[]

    // Actions
    togglePanel: () => void
    sendMessage: (content: string) => Promise<void>
    executeCommand: (command: SlashCommand, selection: string, onStream?: (chunk: string) => void) => Promise<string>
    generateSuggestion: (context: string) => Promise<void>
    clearHistory: () => void
    clearSuggestion: () => void
}

export const useAIStore = create<AIState>((set, get) => ({
    // Initial state
    panelOpen: false,
    isProcessing: false,
    currentSuggestion: null,
    conversationHistory: [],

    // Toggle AI panel
    togglePanel: () => set(state => ({ panelOpen: !state.panelOpen })),

    // Send chat message
    sendMessage: async (content: string) => {
        const { conversationHistory } = get()

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: new Date(),
        }

        set({
            conversationHistory: [...conversationHistory, userMessage],
            isProcessing: true
        })

        try {
            // Prepare conversation for API
            const messages: OpenRouterMessage[] = conversationHistory
                .concat(userMessage)
                .map(msg => ({
                    role: msg.role,
                    content: msg.content,
                }))

            // Get AI response
            const response = await openrouter.generateText(messages)

            // Add assistant message
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date(),
            }

            set(state => ({
                conversationHistory: [...state.conversationHistory, assistantMessage],
                isProcessing: false,
            }))

        } catch (error) {
            console.error('AI chat error:', error)
            set({ isProcessing: false })
            throw error
        }
    },

    // Execute slash command
    executeCommand: async (command: SlashCommand, selection: string, onStream?: (chunk: string) => void) => {
        set({ isProcessing: true })

        try {
            const result = await executeSlashCommand(command, selection, undefined, onStream)
            set({ isProcessing: false })
            return result
        } catch (error) {
            console.error('Command execution error:', error)
            set({ isProcessing: false })
            throw error
        }
    },

    // Generate inline suggestion
    generateSuggestion: async (context: string) => {
        set({ isProcessing: true })

        try {
            const prompt = `Based on this text, suggest the next 1-2 sentences to continue writing. Match the tone and style. Only return the suggestion:\n\n${context}`

            const suggestion = await openrouter.complete(prompt)

            set({
                currentSuggestion: suggestion,
                isProcessing: false
            })

        } catch (error) {
            console.error('Suggestion error:', error)
            set({ isProcessing: false })
        }
    },

    // Clear conversation history
    clearHistory: () => set({ conversationHistory: [] }),

    // Clear current suggestion
    clearSuggestion: () => set({ currentSuggestion: null }),
}))
