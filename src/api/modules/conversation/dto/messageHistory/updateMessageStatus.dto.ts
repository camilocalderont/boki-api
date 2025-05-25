import { MessageStatus, DeliveryStatus } from "../../schemas/messageHistory/messageHistory.schema";

export class UpdateMessageStatusDto {
  waMessageId?: string;
  messageStatus?: MessageStatus;
  deliveryStatus?: DeliveryStatus;
  errorCode?: string;
  errorMessage?: string;
  retryCount?: number;
  nextRetryAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
}