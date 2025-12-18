import { openrouter, OpenRouterMessage } from './openrouter'

export interface SlashCommand {
  trigger: string
  label: string
  description: string
  icon: string
  systemPrompt: (selection: string, context?: string) => string
}

export const slashCommands: SlashCommand[] = [
  {
    trigger: '/improve',
    label: 'Improve Text',
    description: 'Enhance grammar, clarity, and style',
    icon: '✨',
    systemPrompt: (selection) => `Improve the following text by enhancing grammar, clarity, and style. Keep the same general meaning but make it better written. Only return the improved text, no explanations:\n\n${selection}`,
  },
  {
    trigger: '/summarize',
    label: 'Summarize',
    description: 'Create a concise summary',
    icon: '📝',
    systemPrompt: (selection) => `Summarize the following text concisely. Keep only the key points:\n\n${selection}`,
  },
  {
    trigger: '/continue',
    label: 'Continue Writing',
    description: 'Continue from where you left off',
    icon: '✍️',
    systemPrompt: (selection, context) => `Continue writing from the following text. Maintain the same tone and style. Write 2-3 sentences:\n\n${context || selection}`,
  },
  {
    trigger: '/fix',
    label: 'Fix Grammar',
    description: 'Fix spelling and grammar errors',
    icon: '🔧',
    systemPrompt: (selection) => `Fix all spelling and grammar errors in the following text. Return only the corrected text:\n\n${selection}`,
  },
  {
    trigger: '/shorter',
    label: 'Make Shorter',
    description: 'Condense text while keeping key points',
    icon: '📉',
    systemPrompt: (selection) => `Make the following text more concise while retaining all key information:\n\n${selection}`,
  },
  {
    trigger: '/longer',
    label: 'Make Longer',
    description: 'Expand with more detail',
    icon: '📈',
    systemPrompt: (selection) => `Expand the following text with more details and examples while maintaining the same tone:\n\n${selection}`,
  },
  {
    trigger: '/casual',
    label: 'Casual Tone',
    description: 'Convert to casual, friendly language',
    icon: '😊',
    systemPrompt: (selection) => `Rewrite the following text in a casual, friendly tone:\n\n${selection}`,
  },
  {
    trigger: '/formal',
    label: 'Formal Tone',
    description: 'Convert to formal, professional language',
    icon: '👔',
    systemPrompt: (selection) => `Rewrite the following text in a formal, professional tone:\n\n${selection}`,
  },
  {
    trigger: '/technical',
    label: 'Technical Tone',
    description: 'Convert to technical, precise language',
    icon: '🔬',
    systemPrompt: (selection) => `Rewrite the following text in a technical, precise tone with appropriate jargon:\n\n${selection}`,
  },
]

/**
 * Execute a slash command
 */
export async function executeSlashCommand(
  command: SlashCommand,
  selection: string,
  context?: string,
  onStream?: (chunk: string) => void
): Promise<string> {
  const prompt = command.systemPrompt(selection, context)
  
  if (onStream) {
    // Streaming mode
    return new Promise((resolve, reject) => {
      let fullText = ''
      
      openrouter.streamCompletion(
        [{ role: 'user', content: prompt }],
        {
          onChunk: (chunk) => {
            fullText += chunk
            onStream(chunk)
          },
          onComplete: () => resolve(fullText),
          onError: reject,
        }
      )
    })
  } else {
    // Non-streaming mode
    return openrouter.complete(prompt)
  }
}

/**
 * Find slash command by trigger
 */
export function findSlashCommand(trigger: string): SlashCommand | undefined {
  return slashCommands.find(cmd => cmd.trigger === trigger)
}

/**
 * Parse slash command from text
 * Returns { command, args } or null if not a command
 */
export function parseSlashCommand(text: string): {
  command: SlashCommand
  args: string
} | null {
  const match = text.match(/^(\/\w+)(?:\s+(.*))?$/)
  if (!match) return null
  
  const [, trigger, args = ''] = match
  const command = findSlashCommand(trigger)
  
  if (!command) return null
  
  return { command, args }
}

/**
 * Get command suggestions for autocomplete
 */
export function getCommandSuggestions(query: string): SlashCommand[] {
  const lowerQuery = query.toLowerCase()
  
  if (!lowerQuery.startsWith('/')) {
    return []
  }
  
  return slashCommands.filter(cmd => 
    cmd.trigger.toLowerCase().includes(lowerQuery) ||
    cmd.label.toLowerCase().includes(lowerQuery.slice(1))
  )
}
