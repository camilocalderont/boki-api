export class ConversationStateResponseDto {
  _id: string;
  contactId: string;
  flow: string;
  state: Record<string, any>;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
} 