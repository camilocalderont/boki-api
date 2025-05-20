import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { MessageHistoryService } from '../services/messageHistory.service';
import { CreateMessageHistoryDto } from '../dto/messageHistory/createMessageHistory.dto';
import { ApiTokenGuard } from '../../../shared/utils/api-token.guard';
import { BaseMongoDbCrudController } from '../../../shared/controllers/mongo-crud.controller';
import { createMessageHistorySchema } from '../schemas/messageHistory/createMessageHistory.schema';
import { MessageHistoryDocument } from '../schemas/messageHistory/messageHistory.schema';
import { ApiControllerResponse } from '../../../shared/interfaces/api-response.interface';

@Controller('message-history')
@UseGuards(ApiTokenGuard)
export class MessageHistoryController extends BaseMongoDbCrudController<MessageHistoryDocument, CreateMessageHistoryDto, any> {
  constructor(private readonly messageHistoryService: MessageHistoryService) {
    super(messageHistoryService, 'message-history', createMessageHistorySchema, null);
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
      message: 'Conversation history retrieved successfully',
      data: data as MessageHistoryDocument[]
    };
  }
}