export interface IMessage {
    text?: string;
    timestamp: number;
    sent: boolean;
    type: MessageType;
    payload?: MessageImageContentProps;
}

export enum MessageType {
    Text,
    Image,
    Video,
    Audio,
    File,
}

export interface MessageImageContentProps {
    src?:string;
    width?:string|number;
    height?:string|number;
    alt?:string;
}