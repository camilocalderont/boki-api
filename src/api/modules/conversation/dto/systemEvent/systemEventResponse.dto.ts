export class SystemEventResponseDto {
  _id: string;
  contactId: string;
  type: string;
  data: Record<string, any>;
  timestamp: Date;
  createdAt: Date;
} 