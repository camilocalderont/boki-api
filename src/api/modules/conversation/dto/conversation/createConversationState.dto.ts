export class CreateConversationStateDto {
    contactId: string;
    flow: string;
    step: string;
    data?: Record<string, any>;
} 