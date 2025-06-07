import { Controller, Get, Post, Body, Param, UseGuards, Inject, NotFoundException, Delete } from '@nestjs/common';
import { ConversationStateService } from '../services/conversationState.service';
import { CreateConversationStateDto } from '../dto/conversation/createConversationState.dto';
import { UpdateConversationStateDto } from '../dto/conversation/updateConversationState.dto';
import { ApiTokenGuard } from '../../../shared/utils/api-token.guard';
import { BaseMongoDbCrudController } from '../../../shared/controllers/mongo-crud.controller';
import { createConversationStateSchema } from '../schemas/conversationState/createConversationState.schema';
import { updateConversationStateSchema } from '../schemas/conversationState/updateConversationState.schema';
import { ConversationStateDocument } from '../schemas/conversationState/conversationState.schema';
import { ApiControllerResponse } from '../../../shared/interfaces/api-response.interface';
import { Types } from 'mongoose';

@Controller('conversation-states')
@UseGuards(ApiTokenGuard)
export class ConversationStateController extends BaseMongoDbCrudController<ConversationStateDocument, CreateConversationStateDto, UpdateConversationStateDto> {
    constructor(
        @Inject('ConversationStateService')
        private readonly conversationStateService: ConversationStateService
    ) {
        super(conversationStateService, 'conversation-state', createConversationStateSchema, updateConversationStateSchema);
    }

    @Get('contact/:contactId')
    async findByContactId(@Param('contactId') contactId: string): Promise<ApiControllerResponse<any>> {
        let searchContactId: any = contactId;
        if (contactId.match(/^[0-9a-fA-F]{24}$/)) {
            searchContactId = new Types.ObjectId(contactId);
        }

        const data = await this.conversationStateService.findByContactId(searchContactId);
        if (!data) {
            throw new NotFoundException(`Estado de conversación para contacto ${contactId} no encontrado`);
        }

        // Filtrar los datos para retornar solo los campos específicos
        const dataObj = data.toObject ? data.toObject() : data;
        const filteredData = {
            contactId: dataObj.contactId,
            flow: dataObj.flow,
            step: dataObj.step,
            data: dataObj.data,
            createdAt: dataObj['createdAt']
        };

        return {
            message: 'Estado de conversación más reciente recuperado exitosamente',
            data: filteredData
        };
    }

    @Delete('contact/:contactId')
    async deleteByContactId(@Param('contactId') contactId: string): Promise<ApiControllerResponse<void>> {
        await this.conversationStateService.deleteByContactId(contactId);
        return {
            message: `Estados de conversación para el contacto ${contactId} eliminados exitosamente`,
            data: undefined
        };
    }
}