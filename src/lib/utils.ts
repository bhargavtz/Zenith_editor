import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null
            func(...args)
        }

        if (timeout !== null) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(later, wait)
    }
}

export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(date)
}

export function calculateReadingTime(text: string): number {
    const wordsPerMinute = 200
    const words = text.trim().split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
}

export function countWords(text: string): number {
    if (!text.trim()) return 0
    return text.trim().split(/\s+/).length
}

export function countCharacters(text: string): number {
    return text.length
}
