export interface IMessage {
    id?: number,
    text?: string;
    timestamp: number;
    sent: boolean;
    type: MessageType;
    payload?: MessageFileContentProps;
    progess?: number;
}

export enum MessageType {
    Text,
    Image,
    Video,
    Audio,
    File,
}

export interface MessageFileContentProps {
    src: string;
    type?: string;
    name: string;
}

export function isDataDto(data: unknown): data is MessageDTO {
    return (!!data && typeof data === 'object' && 'type' in data);
}


export interface MessageDTO {
    text?: string;
    timestamp: number;
    type: MessageType;
    payload?: FileDTO;
}

export interface FileDTO {
    data: ArrayBuffer;
    name: string;
    type: string;
}