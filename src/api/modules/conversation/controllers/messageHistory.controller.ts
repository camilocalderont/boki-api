import { Controller, Get, Post, Put, Body, Param, UseGuards, Query, HttpCode, HttpStatus, Inject, NotFoundException } from '@nestjs/common';
import { MessageHistoryService } from '../services/messageHistory.service';
import { CreateMessageHistoryDto } from '../dto/messageHistory/createMessageHistory.dto';
import { UpdateMessageStatusDto } from '../dto/messageHistory/updateMessageStatus.dto';
import { MessageStatusWebhookDto } from '../dto/messageHistory/messageStatusWebhook.dto';
import { ApiTokenGuard } from '../../../shared/utils/api-token.guard';
import { BaseMongoDbCrudController } from '../../../shared/controllers/mongo-crud.controller';
import { createMessageHistorySchema } from '../schemas/messageHistory/createMessageHistory.schema';
import { MessageHistoryDocument } from '../schemas/messageHistory/messageHistory.schema';
import { ApiControllerResponse } from '../../../shared/interfaces/api-response.interface';
import { isValidObjectId } from 'mongoose';

@Controller('message-history')
@UseGuards(ApiTokenGuard)
export class MessageHistoryController extends BaseMongoDbCrudController<MessageHistoryDocument, CreateMessageHistoryDto, any> {
  constructor(
    @Inject('MessageHistoryService')
    private readonly messageHistoryService: MessageHistoryService
  ) {
    super(messageHistoryService, 'message-history', createMessageHistorySchema, null);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiControllerResponse<MessageHistoryDocument>> {
    let data: MessageHistoryDocument | null;
    
    if (isValidObjectId(id)) {
      data = await this.messageHistoryService.findOne(id);
    } else {
      data = await this.messageHistoryService.findByMessageId(id);
      if (!data) {
        throw new NotFoundException(`Mensaje con messageId ${id} no encontrado`);
      }
    }
    
    return {
      message: 'Mensaje recuperado exitosamente',
      data: data as unknown as MessageHistoryDocument
    };
  }

  @Get('whatsapp/:messageId')
  async findByWhatsappMessageId(@Param('messageId') messageId: string): Promise<ApiControllerResponse<MessageHistoryDocument>> {
    const data = await this.messageHistoryService.findByMessageId(messageId);
    if (!data) {
      throw new NotFoundException(`Mensaje con messageId ${messageId} no encontrado`);
    }
    return {
      message: 'Mensaje recuperado exitosamente por messageId',
      data: data as unknown as MessageHistoryDocument
    };
  }
  
  @Get('conversation/:contactId')
  async getConversationHistory(
    @Param('contactId') contactId: string,
    @Query('limit') limit?: number,
    @Query('skip') skip?: number
  ): Promise<ApiControllerResponse<MessageHistoryDocument[]>> {
    const data = await this.messageHistoryService.getConversationHistory(
      contactId,
      limit ? parseInt(limit.toString(), 10) : undefined,
      skip ? parseInt(skip.toString(), 10) : undefined
    );
    return {
      message: 'Historial de conversación recuperado exitosamente',
      data: data as unknown as MessageHistoryDocument[]
    };
  }

  // Verificar si un mensaje ya fue procesado (útil para evitar duplicados)
  @Get('processed/:messageId')
  @HttpCode(HttpStatus.OK)
  async isMessageProcessed(@Param('messageId') messageId: string): Promise<ApiControllerResponse<boolean>> {
    const isProcessed = await this.messageHistoryService.isMessageProcessed(messageId);
    return {
      message: 'Estado de procesamiento del mensaje verificado',
      data: isProcessed
    };
  }

  // Buscar mensaje por waMessageId (ID que devuelve WhatsApp)
  @Get('wa-id/:waMessageId')
  @HttpCode(HttpStatus.OK)
  async findByWAMessageId(@Param('waMessageId') waMessageId: string): Promise<ApiControllerResponse<MessageHistoryDocument>> {
    const data = await this.messageHistoryService.findByWAMessageId(waMessageId);
    if (!data) {
      throw new NotFoundException(`Mensaje con waMessageId ${waMessageId} no encontrado`);
    }
    return {
      message: 'Mensaje recuperado exitosamente por waMessageId',
      data: data as unknown as MessageHistoryDocument
    };
  }

  // Actualizar estado de mensaje por WhatsApp ID
  @Put('status/wa/:waMessageId')
  @HttpCode(HttpStatus.OK)
  async updateStatusByWAId(
    @Param('waMessageId') waMessageId: string,
    @Body() updateData: UpdateMessageStatusDto
  ): Promise<ApiControllerResponse<MessageHistoryDocument>> {
    const updated = await this.messageHistoryService.updateMessageStatusByWAId(waMessageId, updateData);
    if (!updated) {
      throw new NotFoundException(`Mensaje con waMessageId ${waMessageId} no encontrado`);
    }
    return {
      message: 'Estado del mensaje actualizado exitosamente por waMessageId',
      data: updated as unknown as MessageHistoryDocument
    };
  }

  // Actualizar estado de mensaje por nuestro messageId
  @Put('status/:messageId')
  @HttpCode(HttpStatus.OK)
  async updateStatusById(
    @Param('messageId') messageId: string,
    @Body() updateData: UpdateMessageStatusDto
  ): Promise<ApiControllerResponse<MessageHistoryDocument>> {
    const updated = await this.messageHistoryService.updateMessageStatusById(messageId, updateData);
    if (!updated) {
      throw new NotFoundException(`Mensaje con messageId ${messageId} no encontrado`);
    }
    return {
      message: 'Estado del mensaje actualizado exitosamente por messageId',
      data: updated as unknown as MessageHistoryDocument
    };
  }

  // Actualizar solo el waMessageId de un mensaje existente
  @Put('wa-id/:messageId')
  @HttpCode(HttpStatus.OK)
  async updateWAMessageId(
    @Param('messageId') messageId: string,
    @Body() body: { waMessageId: string }
  ): Promise<ApiControllerResponse<MessageHistoryDocument>> {
    const updated = await this.messageHistoryService.updateWAMessageId(messageId, body.waMessageId);
    if (!updated) {
      throw new NotFoundException(`Mensaje con messageId ${messageId} no encontrado`);
    }
    return {
      message: 'waMessageId actualizado exitosamente',
      data: updated as unknown as MessageHistoryDocument
    };
  }

  // Procesar webhook de estado desde WhatsApp
  @Post('webhook/status')
  @HttpCode(HttpStatus.OK)
  async processStatusWebhook(@Body() statusData: MessageStatusWebhookDto): Promise<ApiControllerResponse<MessageHistoryDocument | null>> {
    const updated = await this.messageHistoryService.processStatusWebhook(statusData);
    return {
      message: 'Webhook de estado procesado exitosamente',
      data: updated as unknown as MessageHistoryDocument
    };
  }

  // Procesar múltiples webhooks de estado (útil si WhatsApp envía varios a la vez)
  @Post('webhook/status/batch')
  @HttpCode(HttpStatus.OK)
  async processStatusWebhookBatch(@Body() statusDataArray: MessageStatusWebhookDto[]): Promise<ApiControllerResponse<(MessageHistoryDocument | null)[]>> {
    const results = [];
    for (const statusData of statusDataArray) {
      const updated = await this.messageHistoryService.processStatusWebhook(statusData);
      results.push(updated);
    }
    return {
      message: `${statusDataArray.length} webhooks de estado procesados exitosamente`,
      data: results as unknown as (MessageHistoryDocument | null)[]
    };
  }

  // Obtener mensajes pendientes de reintento
  @Get('management/pending-retries')
  @HttpCode(HttpStatus.OK)
  async getPendingRetries(): Promise<ApiControllerResponse<MessageHistoryDocument[]>> {
    const pendingMessages = await this.messageHistoryService.getPendingRetries();
    return {
      message: 'Mensajes pendientes de reintento obtenidos exitosamente',
      data: pendingMessages as unknown as MessageHistoryDocument[]
    };
  }

  // Obtener estadísticas de entrega
  @Get('stats/delivery')
  @HttpCode(HttpStatus.OK)
  async getDeliveryStats(
    @Query('contactId') contactId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ): Promise<ApiControllerResponse<any[]>> {
    const stats = await this.messageHistoryService.getDeliveryStats(
      contactId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
    return {
      message: 'Estadísticas de entrega obtenidas exitosamente',
      data: stats
    };
  }

  // Endpoint específico para que el bot registre mensajes entrantes
  @Post('log/incoming')
  @HttpCode(HttpStatus.CREATED)
  async logIncomingMessage(@Body() body: {
    contactId: string;
    messageId: string;
    text: string;
    flowContext?: { flow: string; step: string };
  }): Promise<ApiControllerResponse<MessageHistoryDocument>> {
    const message = await this.messageHistoryService.logIncomingMessage(
      body.contactId,
      body.messageId,
      body.text,
      body.flowContext
    );
    return {
      message: 'Mensaje entrante registrado exitosamente',
      data: message as unknown as MessageHistoryDocument
    };
  }

  // Endpoint específico para que el bot registre mensajes salientes
  @Post('log/outgoing')
  @HttpCode(HttpStatus.CREATED)
  async logOutgoingMessage(@Body() body: {
    contactId: string;
    messageId: string;
    text: string;
    waMessageId?: string;
    flowContext?: { flow: string; step: string };
  }): Promise<ApiControllerResponse<MessageHistoryDocument>> {
    const message = await this.messageHistoryService.logOutgoingMessage(
      body.contactId,
      body.messageId,
      body.text,
      body.waMessageId,
      body.flowContext
    );
    return {
      message: 'Mensaje saliente registrado exitosamente',
      data: message as unknown as MessageHistoryDocument
    };
  }

  // Obtener resumen de estados de mensajes
  @Get('admin/status-summary')
  @HttpCode(HttpStatus.OK)
  async getStatusSummary(
    @Query('contactId') contactId?: string,
    @Query('hours') hours?: number
  ): Promise<ApiControllerResponse<any>> {
    const hoursAgo = hours ? new Date(Date.now() - hours * 60 * 60 * 1000) : undefined;
    const stats = await this.messageHistoryService.getDeliveryStats(contactId, hoursAgo);
    
    // Calcular resumen
    const summary = {
      total: stats.reduce((sum, stat) => sum + stat.count, 0),
      byStatus: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      period: hours ? `Últimas ${hours} horas` : 'Todos los registros'
    };
    
    return {
      message: 'Resumen de estados obtenido exitosamente',
      data: summary
    };
  }
}