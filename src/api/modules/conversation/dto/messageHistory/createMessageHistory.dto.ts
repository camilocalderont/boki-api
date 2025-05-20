import { MessageDirection } from "../../schemas/messageHistory/messageHistory.schema";
import { FlowContextDto } from "./flowContext.dto";
import { MessageContentDto } from "./messageContent.dto";

export class CreateMessageHistoryDto {
  messageId: string;
  contactId: string;
  direction: MessageDirection;
  content: MessageContentDto;
  flowContext?: FlowContextDto;
} 