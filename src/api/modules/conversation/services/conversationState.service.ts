import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConversationState, ConversationStateDocument } from '../schemas/conversationState/conversationState.schema';
import { CreateConversationStateDto } from '../dto/conversation/createConversationState.dto';
import { UpdateConversationStateDto } from '../dto/conversation/updateConversationState.dto';
import { BaseMongoDbCrudService } from '../../../shared/services/mongo-crud.service';

@Injectable()
export class ConversationStateService extends BaseMongoDbCrudService<ConversationStateDocument, CreateConversationStateDto, UpdateConversationStateDto> {
  constructor(
    @InjectModel(ConversationState.name) private conversationStateModel: Model<ConversationStateDocument>
  ) {
    super(conversationStateModel);
  }

  async findByContactId(contactId: string | Types.ObjectId): Promise<ConversationStateDocument> {
    const doc = await this.conversationStateModel
      .findOne({ contactId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return this.transformMongoDocument(doc);
  }

  async deleteByContactId(contactId: string): Promise<void> {
    await this.conversationStateModel.deleteMany({ contactId }).exec();
  }
}