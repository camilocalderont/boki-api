import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageHistory, MessageHistoryDocument, MessageDirection } from '../schemas/messageHistory/messageHistory.schema';
import { CreateMessageHistoryDto } from '../dto/messageHistory/createMessageHistory.dto';
import { BaseMongoDbCrudService } from '../../../shared/services/mongo-crud.service';

@Injectable()
export class MessageHistoryService extends BaseMongoDbCrudService<MessageHistoryDocument, CreateMessageHistoryDto, any> {
  constructor(
    @InjectModel(MessageHistory.name) private messageHistoryModel: Model<MessageHistoryDocument>
  ) {
    super(messageHistoryModel);
  }

  async findByMessageId(messageId: string): Promise<MessageHistory | null> {
    return this.messageHistoryModel.findOne({ messageId }).exec();
  }

  async getConversationHistory(contactId: string, limit: number = 50, skip: number = 0): Promise<MessageHistory[]> {
    return this.messageHistoryModel
      .find({ contactId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async isMessageProcessed(messageId: string): Promise<boolean> {
    const message = await this.findByMessageId(messageId);
    return !!message;
  }

  async logIncomingMessage(
    contactId: string, 
    messageId: string, 
    text: string, 
    flowContext?: { flow: string; step: string }
  ): Promise<MessageHistory> {
    const dto: CreateMessageHistoryDto = {
      contactId,
      messageId,
      direction: MessageDirection.INBOUND,
      content: {
        type: 'text',
        text
      },
      flowContext
    };
    return this.create(dto);
  }

  async logOutgoingMessage(
    contactId: string, 
    messageId: string, 
    text: string, 
    flowContext?: { flow: string; step: string }
  ): Promise<MessageHistory> {
    const dto: CreateMessageHistoryDto = {
      contactId,
      messageId,
      direction: MessageDirection.OUTBOUND,
      content: {
        type: 'text',
        text
      },
      flowContext
    };
    return this.create(dto);
  }
}