import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SystemEvent, SystemEventDocument } from '../schemas/systemEvent/systemEvent.schema';
import { CreateSystemEventDto } from '../dto/systemEvent/createSystemEvent.dto';
import { BaseMongoDbCrudService } from '../../../shared/services/mongo-crud.service';

@Injectable()
export class SystemEventService extends BaseMongoDbCrudService<SystemEventDocument, CreateSystemEventDto, any> {
  constructor(
    @InjectModel(SystemEvent.name) private systemEventModel: Model<SystemEventDocument>
  ) {
    super(systemEventModel);
  }

  async getEventsByContactId(contactId: string, limit: number = 50, skip: number = 0): Promise<SystemEvent[]> {
    return this.systemEventModel
      .find({ contactId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async getEventsByType(type: string, limit: number = 50, skip: number = 0): Promise<SystemEvent[]> {
    return this.systemEventModel
      .find({ type })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async logFlowChange(contactId: string, fromFlow: string, toFlow: string): Promise<SystemEvent> {
    return this.create({
      contactId,
      type: 'flow_change',
      data: { fromFlow, toFlow }
    });
  }
}