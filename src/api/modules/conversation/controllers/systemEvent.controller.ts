import { Controller, Get, Post, Body, Param, UseGuards, Query, Inject } from '@nestjs/common';
import { SystemEventService } from '../services/systemEvent.service';
import { CreateSystemEventDto } from '../dto/systemEvent/createSystemEvent.dto';
import { ApiTokenGuard } from '../../../shared/utils/api-token.guard';
import { BaseMongoDbCrudController } from '../../../shared/controllers/mongo-crud.controller';
import { createSystemEventSchema } from '../schemas/systemEvent/createSystemEvent.schema';
import { SystemEvent, SystemEventDocument } from '../schemas/systemEvent/systemEvent.schema';
import { ApiControllerResponse } from '../../../shared/interfaces/api-response.interface';

@Controller('system-events')
@UseGuards(ApiTokenGuard)
export class SystemEventController extends BaseMongoDbCrudController<SystemEventDocument, CreateSystemEventDto, any> {
  constructor(
    @Inject('SystemEventService')
    private readonly systemEventService: SystemEventService
  ) {
    super(systemEventService, 'system-event', createSystemEventSchema, null);
  }

  @Get('contact/:contactId')
  async getEventsByContactId(
    @Param('contactId') contactId: string,
    @Query('limit') limit?: number,
    @Query('skip') skip?: number
  ): Promise<ApiControllerResponse<SystemEventDocument[]>> {
    const data = await this.systemEventService.getEventsByContactId(
      contactId,
      limit ? parseInt(String(limit), 10) : undefined,
      skip ? parseInt(String(skip), 10) : undefined
    );
    return {
      message: 'System events retrieved successfully',
      data: data as SystemEventDocument[]
    };
  }
}