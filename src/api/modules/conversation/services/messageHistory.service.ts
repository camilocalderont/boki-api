import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageHistory, MessageHistoryDocument, MessageDirection } from '../schemas/messageHistory/messageHistory.schema';
import { BaseMongoDbCrudService } from '../../../shared/services/mongo-crud.service';

@Injectable()
export class MessageHistoryService extends BaseMongoDbCrudService<MessageHistoryDocument, any, any> {
  constructor(
    @InjectModel(MessageHistory.name) private messageHistoryModel: Model<MessageHistoryDocument>
  ) {
    super(messageHistoryModel);
  }

  // Buscar por messageId (ID del mensaje de WhatsApp)
  async findByMessageId(messageId: string): Promise<MessageHistoryDocument | null> {
    const doc = await this.messageHistoryModel.findOne({ messageId }).lean().exec();
    return this.transformMongoDocument(doc);
  }

  // Obtener historial de conversación
  async getConversationHistory(contactId: string, limit: number = 50, skip: number = 0): Promise<MessageHistoryDocument[]> {
    const results = await this.messageHistoryModel
      .find({ contactId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    return results.map(doc => this.transformMongoDocument(doc));
  }

  // Verificar si un mensaje ya fue procesado
  async isMessageProcessed(messageId: string): Promise<boolean> {
    const message = await this.findByMessageId(messageId);
    return !!message;
  }

  // Registrar mensaje entrante
  async logIncomingMessage(
    contactId: string, 
    messageId: string, 
    text: string, 
    flowContext?: { flow: string; step: string }
  ): Promise<MessageHistory> {
    const messageData = {
      contactId,
      messageId,
      direction: MessageDirection.INBOUND,
      content: {
        type: 'text',
        text
      },
      flowContext
    };
    
    return this.create(messageData);
  }

  // Registrar mensaje saliente
  async logOutgoingMessage(
    contactId: string, 
    messageId: string, 
    text: string, 
    waMessageId?: string, 
    flowContext?: { flow: string; step: string }
  ): Promise<MessageHistory> {
    const messageData = {
      contactId,
      messageId,
      waMessageId, 
      direction: MessageDirection.OUTBOUND,
      content: {
        type: 'text',
        text
      },
      flowContext
    };
    
    return this.create(messageData);
  }
}