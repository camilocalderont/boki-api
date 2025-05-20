import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ConversationStateService } from '../services/conversationState.service';
import { CreateConversationStateDto } from '../dto/conversation/createConversationState.dto';
import { UpdateConversationStateDto } from '../dto/conversation/updateConversationState.dto';
import { ApiTokenGuard } from '../../../shared/utils/api-token.guard';
import { BaseMongoDbCrudController } from '../../../shared/controllers/mongo-crud.controller';
import { createConversationStateSchema } from '../schemas/conversationState/createConversationState.schema';
import { updateConversationStateSchema } from '../schemas/conversationState/updateConversationState.schema';
import { ConversationStateDocument } from '../schemas/conversationState/conversationState.schema';  

@Controller('conversation-states')
@UseGuards(ApiTokenGuard)
export class ConversationStateController extends BaseMongoDbCrudController<ConversationStateDocument, CreateConversationStateDto, UpdateConversationStateDto> {
    constructor(private readonly conversationStateService: ConversationStateService) {
        super(conversationStateService, 'conversation-state', createConversationStateSchema, updateConversationStateSchema);
    }
}