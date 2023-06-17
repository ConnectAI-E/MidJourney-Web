export interface ChatMessage {
    role: 'system' | 'user' | 'assistant'
    content: string
    date?: string
    time?: number
}


export interface ErrorMessage {
    code?: any
    message: string
}
