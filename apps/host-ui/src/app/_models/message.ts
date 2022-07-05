export interface Message {
    id: number;
    senderId: number;
    senderUserName: string;
    senderPhototUrl: string;
    recipientId: number;
    recipientUserName: string;
    recipientPhototUrl: string;
    content: string;
    dateRead?: Date;
    messageSent: Date;
}