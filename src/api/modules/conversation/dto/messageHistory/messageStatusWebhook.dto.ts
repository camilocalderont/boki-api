export class MessageStatusWebhookDto {
    id: string; 
    status: string; 
    timestamp: string;
    recipient_id?: string;
    errors?: Array<{
      code: number;
      title: string;
      message?: string;
    }>;
  }