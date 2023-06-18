export interface ChatMessage {
    role: 'system' | 'user' | 'assistant'
    content: string
    result?: MidjourneyResult
    date?: string
    time?: number
}


export interface ErrorMessage {
    code?: any
    message: string
}

export interface MidjourneyResult{
    taskId: string
    action:  'IMAGINE'
    imgUrl:string
    status:  'SUCCESS'
    finished: boolean
}



