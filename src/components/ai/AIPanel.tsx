import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Sparkles, Trash2 } from 'lucide-react'
import { useAIStore } from '@/stores/ai'
import { cn } from '@/lib/utils'

interface AIPanelProps {
    isOpen: boolean
    onClose: () => void
}

export function AIPanel({ isOpen, onClose }: AIPanelProps) {
    const [input, setInput] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const { conversationHistory, isProcessing, sendMessage, clearHistory } = useAIStore()

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [conversationHistory])

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [isOpen])

    const handleSend = async () => {
        if (!input.trim() || isProcessing) return

        const message = input
        setInput('')

        try {
            await sendMessage(message)
        } catch (error) {
            console.error('Failed to send message:', error)
            alert('Failed to send message. Check your API key.')
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: 400, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 400, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="flex h-full w-96 flex-col border-l border-border bg-background"
                    role="complementary"
                    aria-label="AI Assistant Panel"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border p-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
                            <h2 className="font-semibold">AI Assistant</h2>
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={clearHistory}
                                className="rounded-lg p-1.5 hover:bg-muted transition-colors"
                                aria-label="Clear conversation"
                                title="Clear conversation"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={onClose}
                                className="rounded-lg p-1.5 hover:bg-muted transition-colors"
                                aria-label="Close AI panel"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {conversationHistory.length === 0 ? (
                            <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                                <div>
                                    <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p className="text-sm">Ask me anything!</p>
                                    <p className="text-xs mt-1">Type a message to start</p>
                                </div>
                            </div>
                        ) : (
                            conversationHistory.map((message) => (
                                <div
                                    key={message.id}
                                    className={cn(
                                        "flex gap-3",
                                        message.role === 'user' && "justify-end"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "max-w-[80%] rounded-lg px-4 py-2",
                                            message.role === 'user'
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted"
                                        )}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                </div>
                            ))
                        )}

                        {isProcessing && (
                            <div className="flex gap-3">
                                <div className="max-w-[80%] rounded-lg bg-muted px-4 py-2">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t border-border p-4">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a message..."
                                disabled={isProcessing}
                                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                                aria-label="Message input"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isProcessing}
                                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                aria-label="Send message"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
