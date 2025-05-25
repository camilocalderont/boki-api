import { DeliveryStatus, MessageDirection, MessageStatus } from "../../schemas/messageHistory/messageHistory.schema";
import { FlowContextDto } from "./flowContext.dto";
import { MessageContentDto } from "./messageContent.dto";

export class CreateMessageHistoryDto {
  messageId: string;
  waMessageId?: string;
  contactId: string;
  direction: MessageDirection;
  content: MessageContentDto;
  flowContext?: FlowContextDto;
  messageStatus?: MessageStatus;
  deliveryStatus?: DeliveryStatus;
}