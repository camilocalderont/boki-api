export class ContactResponseDto {
    _id: string;
    phone: string;
    clientId?: number;
    lastInteraction: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
} 