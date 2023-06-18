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
    action: ActionCmd
    imgUrl:string
    status: string
    finished: boolean
}

export enum ActionCmd {
    IMAGINE = 'IMAGINE',
}


export enum Status {
    SUCCESS = 'SUCCESS',
}
