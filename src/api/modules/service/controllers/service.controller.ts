import { Controller, Get, Param, ParseIntPipe, UsePipes, ValidationPipe, Inject } from '@nestjs/common';
import { ServiceEntity } from '../entities/service.entity';
import { ServiceService } from '../services/service.service';
import { CreateServiceDto } from '../dto/serviceCreate.dto';
import { UpdateServiceDto } from '../dto/serviceUpdate.dto';
import { BaseCrudController } from '../../../shared/controllers/crud.controller';

@Controller('services')
@UsePipes(new ValidationPipe())
export class ServiceController extends BaseCrudController<ServiceEntity, CreateServiceDto, UpdateServiceDto> {
    constructor(
        @Inject(ServiceService)
        private readonly serviceService: ServiceService
    ) {
        super(serviceService, 'Service');
    }

    @Get('company/:id')
    async findByCompany(@Param('id', ParseIntPipe) id: number): Promise<ServiceEntity[]> {
        return this.serviceService.findByCompany(id);
    }

    @Get('category/:id')
    async findByCategory(@Param('id', ParseIntPipe) id: number): Promise<ServiceEntity[]> {
        return this.serviceService.findByCategory(id);
    }
}
