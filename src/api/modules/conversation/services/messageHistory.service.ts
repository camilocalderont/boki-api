import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { MessageHistory, MessageHistoryDocument, MessageDirection, MessageStatus, DeliveryStatus } from '../schemas/messageHistory/messageHistory.schema';
import { CreateMessageHistoryDto } from '../dto/messageHistory/createMessageHistory.dto';
import { UpdateMessageStatusDto } from '../dto/messageHistory/updateMessageStatus.dto';
import { MessageStatusWebhookDto } from '../dto/messageHistory/messageStatusWebhook.dto';
import { BaseMongoDbCrudService } from '../../../shared/services/mongo-crud.service';

@Injectable()
export class MessageHistoryService extends BaseMongoDbCrudService<MessageHistoryDocument, CreateMessageHistoryDto, any> {
  constructor(
    @InjectModel(MessageHistory.name) private messageHistoryModel: Model<MessageHistoryDocument>
  ) {
    super(messageHistoryModel);
  }

  // Buscar por messageId (ID del mensaje de WhatsApp)
  async findByMessageId(messageId: string): Promise<MessageHistoryDocument | null> {
    try {
      return this.messageHistoryModel.findOne({ messageId }).exec();
    } catch (error) {
      console.error(`Error al buscar mensaje por messageId ${messageId}:`, error);
      return null;
    }
  }

  // Mantener compatibilidad con el método anterior
  async findBymessageId(messageId: string): Promise<MessageHistoryDocument | null> {
    return this.findByMessageId(messageId);
  }

  // Buscar por _id de MongoDB
  async findOne(id: string): Promise<MessageHistoryDocument> {
    try {
      // Verificar si el ID tiene un formato válido de ObjectId
      if (!isValidObjectId(id)) {
        throw new BadRequestException(`ID '${id}' no tiene un formato válido de ObjectId de MongoDB`);
      }
      
      const entity = await this.messageHistoryModel.findById(id).exec();
      if (!entity) {
        throw new NotFoundException(`Mensaje con _id ${id} no encontrado`);
      }
      return entity;
    } catch (error) {
      // Si el error ya es una excepción de NestJS, simplemente relanzarla
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      
      console.error(`Error al buscar mensaje por _id ${id}:`, error);
      throw new BadRequestException(`Error al procesar el _id: ${id}`);
    }
  }

  async getConversationHistory(contactId: string, limit: number = 50, skip: number = 0): Promise<MessageHistoryDocument[]> {
    try {
      console.log(`Buscando historial de conversación para contactId: ${contactId}, limit: ${limit}, skip: ${skip}`);
      
      // Verificar si el contactId tiene un formato válido si es un ObjectId
      if (contactId.match(/^[0-9a-fA-F]{24}$/)) {
        if (!isValidObjectId(contactId)) {
          throw new BadRequestException(`ID de contacto '${contactId}' no tiene un formato válido`);
        }
      }
      
      const messages = await this.messageHistoryModel
        .find({ contactId })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
      
      console.log(`Se encontraron ${messages.length} mensajes para el contacto ${contactId}`);
      return messages;
    } catch (error) {
      // Si el error ya es una excepción de NestJS, simplemente relanzarla
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      console.error(`Error al buscar historial de conversación para contactId ${contactId}:`, error);
      throw new BadRequestException(`Error al procesar el historial para el contacto: ${contactId}`);
    }
  }

  async isMessageProcessed(messageId: string): Promise<boolean> {
    const message = await this.findByMessageId(messageId);
    return !!message;
  }

  // Buscar por waMessageId (ID que devuelve WhatsApp al enviar)
  async findByWAMessageId(waMessageId: string): Promise<MessageHistoryDocument | null> {
    try {
      return this.messageHistoryModel.findOne({ waMessageId }).exec();
    } catch (error) {
      console.error(`Error al buscar mensaje por waMessageId ${waMessageId}:`, error);
      return null;
    }
  }

  // Actualizar estado de mensaje por WhatsApp ID
  async updateMessageStatusByWAId(waMessageId: string, updateData: UpdateMessageStatusDto): Promise<MessageHistoryDocument | null> {
    try {
      const updated = await this.messageHistoryModel.findOneAndUpdate(
        { waMessageId },
        { 
          $set: {
            ...updateData,
            updatedAt: new Date()
          }
        },
        { new: true }
      ).exec();

      if (!updated) {
        console.warn(`Mensaje con WhatsApp ID ${waMessageId} no encontrado para actualizar estado`);
        return null;
      }

      console.log(`Estado actualizado para mensaje con waMessageId ${waMessageId}:`, updateData);
      return updated;
    } catch (error) {
      console.error(`Error al actualizar estado del mensaje ${waMessageId}:`, error);
      throw new BadRequestException(`Error al actualizar estado del mensaje: ${error.message}`);
    }
  }

  // Actualizar estado de mensaje por nuestro ID
  async updateMessageStatusById(messageId: string, updateData: UpdateMessageStatusDto): Promise<MessageHistoryDocument | null> {
    try {
      const updated = await this.messageHistoryModel.findOneAndUpdate(
        { messageId },
        { 
          $set: {
            ...updateData,
            updatedAt: new Date()
          }
        },
        { new: true }
      ).exec();

      if (!updated) {
        console.warn(`Mensaje con ID ${messageId} no encontrado para actualizar estado`);
        return null;
      }

      console.log(`Estado actualizado para mensaje con messageId ${messageId}:`, updateData);
      return updated;
    } catch (error) {
      console.error(`Error al actualizar estado del mensaje ${messageId}:`, error);
      throw new BadRequestException(`Error al actualizar estado del mensaje: ${error.message}`);
    }
  }

  // Procesar webhook de estado desde WhatsApp
  async processStatusWebhook(statusData: MessageStatusWebhookDto): Promise<MessageHistoryDocument | null> {
    try {
      console.log(`Procesando webhook de estado para waMessageId ${statusData.id}:`, statusData);

      const updateData: UpdateMessageStatusDto = {
        deliveryStatus: this.mapWhatsAppStatus(statusData.status),
      };

      // Si hay errores, incluirlos
      if (statusData.errors && statusData.errors.length > 0) {
        const error = statusData.errors[0];
        updateData.errorCode = error.code.toString();
        updateData.errorMessage = error.title;
        updateData.messageStatus = MessageStatus.FAILED;
        updateData.deliveryStatus = DeliveryStatus.FAILED;
        
        console.log(`Mensaje ${statusData.id} falló:`, error);
      } else {
        // Actualizar messageStatus basado en deliveryStatus
        switch (updateData.deliveryStatus) {
          case DeliveryStatus.DELIVERED:
            updateData.messageStatus = MessageStatus.DELIVERED;
            updateData.deliveredAt = new Date();
            break;
          case DeliveryStatus.READ:
            updateData.messageStatus = MessageStatus.READ;
            updateData.readAt = new Date();
            break;
          case DeliveryStatus.SENT:
            updateData.messageStatus = MessageStatus.SENT;
            break;
        }
      }

      const updated = await this.updateMessageStatusByWAId(statusData.id, updateData);

      // Si falló, manejar reintento si es necesario
      if (updated && updateData.deliveryStatus === DeliveryStatus.FAILED) {
        await this.handleFailedMessage(updated);
      }

      return updated;
    } catch (error) {
      console.error(`Error al procesar webhook de estado:`, error);
      throw new BadRequestException(`Error al procesar webhook de estado: ${error.message}`);
    }
  }

  // Obtener mensajes pendientes de reintento
  async getPendingRetries(): Promise<MessageHistoryDocument[]> {
    try {
      const now = new Date();
      const pendingMessages = await this.messageHistoryModel.find({
        messageStatus: MessageStatus.PENDING,
        nextRetryAt: { $lte: now },
        $expr: { $lt: ["$retryCount", "$maxRetries"] }
      }).exec();

      console.log(`Se encontraron ${pendingMessages.length} mensajes pendientes de reintento`);
      return pendingMessages;
    } catch (error) {
      console.error(`Error al obtener mensajes pendientes de reintento:`, error);
      return [];
    }
  }

  // Manejar mensaje fallido y programar reintento
  private async handleFailedMessage(message: MessageHistoryDocument): Promise<void> {
    try {
      if (message.retryCount < message.maxRetries) {
        // Calcular próximo reintento (exponential backoff)
        const retryDelayMinutes = Math.pow(2, message.retryCount) * 5; // 5, 10, 20, 40 minutos...
        const nextRetryAt = new Date();
        nextRetryAt.setMinutes(nextRetryAt.getMinutes() + retryDelayMinutes);

        await this.updateMessageStatusById(message.messageId, {
          retryCount: message.retryCount + 1,
          nextRetryAt,
          messageStatus: MessageStatus.PENDING
        });

        console.log(`Programado reintento ${message.retryCount + 1}/${message.maxRetries} para mensaje ${message.messageId} en ${retryDelayMinutes} minutos`);
      } else {
        // Falló permanentemente
        await this.updateMessageStatusById(message.messageId, {
          messageStatus: MessageStatus.EXPIRED,
          nextRetryAt: undefined
        });

        console.log(`Mensaje ${message.messageId} falló permanentemente después de ${message.maxRetries} reintentos`);
      }
    } catch (error) {
      console.error(`Error al manejar mensaje fallido ${message.messageId}:`, error);
    }
  }

  // Mapear estados de WhatsApp a nuestros estados
  private mapWhatsAppStatus(waStatus: string): DeliveryStatus {
    const mapping = {
      'sent': DeliveryStatus.SENT,
      'delivered': DeliveryStatus.DELIVERED,
      'read': DeliveryStatus.READ,
      'failed': DeliveryStatus.FAILED,
    };
    return mapping[waStatus] || DeliveryStatus.UNKNOWN;
  }

  // Obtener estadísticas de entrega
  async getDeliveryStats(contactId?: string, startDate?: Date, endDate?: Date) {
    try {
      const matchConditions: any = {
        direction: MessageDirection.OUTBOUND
      };

      if (contactId) matchConditions.contactId = contactId;
      if (startDate || endDate) {
        matchConditions.timestamp = {};
        if (startDate) matchConditions.timestamp.$gte = startDate;
        if (endDate) matchConditions.timestamp.$lte = endDate;
      }

      const stats = await this.messageHistoryModel.aggregate([
        { $match: matchConditions },
        { 
          $group: {
            _id: '$deliveryStatus',
            count: { $sum: 1 }
          }
        }
      ]).exec();

      console.log(`Estadísticas de entrega obtenidas:`, stats);
      return stats;
    } catch (error) {
      console.error(`Error al obtener estadísticas de entrega:`, error);
      return [];
    }
  }

  // Actualizar logIncomingMessage para incluir estado
  async logIncomingMessage(
    contactId: string, 
    messageId: string, 
    text: string, 
    flowContext?: { flow: string; step: string }
  ): Promise<MessageHistory> {
    try {
      const dto: CreateMessageHistoryDto = {
        contactId,
        messageId,
        direction: MessageDirection.INBOUND,
        content: {
          type: 'text',
          text
        },
        flowContext,
        messageStatus: MessageStatus.PROCESSING, 
        deliveryStatus: DeliveryStatus.DELIVERED 
      };
      
      const result = await this.create(dto);
      console.log(`Mensaje entrante registrado: ${messageId} de contacto ${contactId}`);
      return result;
    } catch (error) {
      console.error(`Error al registrar mensaje entrante ${messageId}:`, error);
      throw error;
    }
  }

  async logOutgoingMessage(
    contactId: string, 
    messageId: string, 
    text: string, 
    waMessageId?: string, 
    flowContext?: { flow: string; step: string }
  ): Promise<MessageHistory> {
    try {
      const dto: CreateMessageHistoryDto = {
        contactId,
        messageId,
        waMessageId, 
        direction: MessageDirection.OUTBOUND,
        content: {
          type: 'text',
          text
        },
        flowContext,
        messageStatus: waMessageId ? MessageStatus.SENT : MessageStatus.PENDING, 
        deliveryStatus: waMessageId ? DeliveryStatus.SENT : DeliveryStatus.UNKNOWN 
      };
      
      const result = await this.create(dto);
      console.log(`Mensaje saliente registrado: ${messageId} para contacto ${contactId}${waMessageId ? ` (waMessageId: ${waMessageId})` : ''}`);
      return result;
    } catch (error) {
      console.error(`Error al registrar mensaje saliente ${messageId}:`, error);
      throw error;
    }
  }

  async updateWAMessageId(messageId: string, waMessageId: string): Promise<MessageHistoryDocument | null> {
    try {
      const updated = await this.updateMessageStatusById(messageId, {
        waMessageId,
        messageStatus: MessageStatus.SENT,
        deliveryStatus: DeliveryStatus.SENT
      });
      
      if (updated) {
        console.log(`waMessageId actualizado para mensaje ${messageId}: ${waMessageId}`);
      }
      
      return updated;
    } catch (error) {
      console.error(`Error al actualizar waMessageId para mensaje ${messageId}:`, error);
      return null;
    }
  }
}