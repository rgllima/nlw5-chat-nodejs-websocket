export interface ISettingCreate {
    chat: boolean
    username: string
}

export interface IMessageCreate {
    text: string
    admin_id?: string
    user_id: string
}

export interface IConnectionCreate {
    id?: string
    admin_id?: string
    user_id: string
    socket_id: string
}

export interface ISocketParams {
    text: string
    email: string
}
