export class UpdateConversationStateDto {
    flow?: string;
    state?: Record<string, any>;
    expiresAt?: Date;
} 