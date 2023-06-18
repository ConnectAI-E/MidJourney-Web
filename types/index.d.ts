export interface ChatMessage {
    role: 'system' | 'user' | 'assistant'
    content: string // 消息内容
    result?: MidjourneyResult // mj result
    action?: ActionType // 用户发起的命令类型
    date?: string
    time?: number
}

export type ActionType = 'IMAGINE'

export interface ErrorMessage {
    code?: any
    message: string
}

export interface MidjourneyResult{
    prompt?: string
    promptEn?: string
    taskId?: string
    action?:  ActionType
    imgUrl?:string
    status?:  'SUCCESS'
    progress?: string
    finished?: boolean
}



