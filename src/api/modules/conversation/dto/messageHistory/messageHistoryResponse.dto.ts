import { MessageContentDto } from "./messageContent.dto";
import { MessageDirection } from "../../schemas/messageHistory/messageHistory.schema";
import { FlowContextDto } from "./flowContext.dto";

export class MessageHistoryResponseDto {
    _id: string;
    messageId: string;
    contactId: string;
    direction: MessageDirection;
    content: MessageContentDto;
    flowContext?: FlowContextDto;
    timestamp: Date;
    createdAt: Date;
  }