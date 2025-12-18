import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser'

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface StreamOptions {
  onChunk: (text: string) => void
  onComplete: () => void
  onError: (error: Error) => void
}

interface OpenRouterResponse {
  id: string
  choices: {
    message: {
      content: string
    }
    finish_reason: string
  }[]
}

class OpenRouterClient {
  private apiKey: string
  private model: string
  private maxTokens: number
  private baseURL = 'https://openrouter.ai/api/v1'

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || ''
    this.model = import.meta.env.VITE_AI_MODEL || 'openai/gpt-oss-20b:free'
    this.maxTokens = parseInt(import.meta.env.VITE_AI_MAX_TOKENS || '2000')

    if (!this.apiKey) {
      console.warn('OpenRouter API key not found. Set VITE_OPENROUTER_API_KEY in .env')
    }
  }

  /**
   * Stream completion from OpenRouter
   */
  async streamCompletion(
    messages: OpenRouterMessage[],
    options: StreamOptions
  ): Promise<void> {
    if (!this.apiKey) {
      options.onError(new Error('OpenRouter API key not configured'))
      return
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Zenith Editor',
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          stream: true,
          max_tokens: this.maxTokens,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'API request failed')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Stream reader not available')
      }

      const decoder = new TextDecoder()
      let fullText = ''

      const parser = createParser((event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data
          if (data === '[DONE]') {
            options.onComplete()
            return
          }

          try {
            const json = JSON.parse(data)
            const content = json.choices?.[0]?.delta?.content
            if (content) {
              fullText += content
              options.onChunk(content)
            }
          } catch (e) {
            console.error('Failed to parse SSE data:', e)
          }
        }
      })

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        parser.feed(chunk)
      }

    } catch (error) {
      options.onError(error as Error)
    }
  }

  /**
   * Generate text (non-streaming)
   */
  async generateText(messages: OpenRouterMessage[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured')
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Zenith Editor',
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          max_tokens: this.maxTokens,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'API request failed')
      }

      const data: OpenRouterResponse = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error('OpenRouter API error:', error)
      throw error
    }
  }

  /**
   * Simple prompt completion
   */
  async complete(prompt: string, systemPrompt?: string): Promise<string> {
    const messages: OpenRouterMessage[] = []
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt })
    }
    
    messages.push({ role: 'user', content: prompt })
    
    return this.generateText(messages)
  }

  /**
   * Check if API key is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey
  }
}

// Export singleton instance
export const openrouter = new OpenRouterClient()
export type { OpenRouterMessage, StreamOptions }
