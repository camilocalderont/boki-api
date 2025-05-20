export class CreateConversationStateDto {
    contactId: string;
    flow: string;
    state: Record<string, any>;
    expiresAt?: Date;
} 