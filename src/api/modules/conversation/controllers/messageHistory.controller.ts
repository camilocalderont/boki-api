import { Controller, Get, Post, Body, Param, UseGuards, Query, HttpCode, HttpStatus, Inject, NotFoundException } from '@nestjs/common';
import { MessageHistoryService } from '../services/messageHistory.service';
import { ApiTokenGuard } from '../../../shared/utils/api-token.guard';
import { logIncomingMessageSchema } from '../schemas/messageHistory/logIncomingMessage.schema';
import { logOutgoingMessageSchema } from '../schemas/messageHistory/logOutgoingMessage.schema';
import { MessageHistoryDocument } from '../schemas/messageHistory/messageHistory.schema';
import { ApiControllerResponse } from '../../../shared/interfaces/api-response.interface';
import { UseJoiValidationPipe } from '../../../shared/utils/pipes/use-joi.pipe';

@Controller('message-history')
@UseGuards(ApiTokenGuard)
export class MessageHistoryController {
  constructor(
    @Inject('MessageHistoryService')
    private readonly messageHistoryService: MessageHistoryService
  ) {}

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
  ): Promise<ApiControllerResponse<any[]>> {
    const data = await this.messageHistoryService.getConversationHistory(
      contactId,
      limit ? parseInt(limit.toString(), 10) : undefined,
      skip ? parseInt(skip.toString(), 10) : undefined
    );
    
    // Filtrar los datos para retornar solo los campos específicos
    const filteredData = data.map(message => ({
      contactId: message.contactId,
      direction: message.direction,
      content: message.content,
      flowContext: message.flowContext,
      timestamp: message.timestamp
    }));
    
    return {
      message: 'Historial de conversación recuperado exitosamente',
      data: filteredData
    };
  }

  // Endpoint específico para que el bot registre mensajes entrantes
  @Post('log/incoming')
  @HttpCode(HttpStatus.CREATED)
  @UseJoiValidationPipe(() => logIncomingMessageSchema)
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
  @UseJoiValidationPipe(() => logOutgoingMessageSchema)
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

}