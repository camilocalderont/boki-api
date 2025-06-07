import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceEntity } from '../entities/service.entity';

@Injectable()
export class ServiceRepository {
    constructor(
        @InjectRepository(ServiceEntity)
        private readonly serviceRepository: Repository<ServiceEntity>,
    ) {}

    async findByCategoryIdForLLM(categoryId: number): Promise<{ Id: number; VcName: string; VcDescription: string; IRegularPrice: number; VcTime: string }[]> {
        try {
            const services = await this.serviceRepository.find({ 
                where: { CategoryId: categoryId },
                select: ['Id', 'VcName', 'VcDescription', 'IRegularPrice', 'VcTime']
            });
            
            return services.map(service => ({
                Id: service.Id,
                VcName: service.VcName,
                VcDescription: service.VcDescription,
                IRegularPrice: service.IRegularPrice,
                VcTime: service.VcTime
            }));
        } catch (error) {
            throw error;
        }
    }

    async findByCompanyIdForLLM(companyId: number): Promise<{ Id: number; VcName: string; VcDescription: string; IRegularPrice: number; VcTime: string; Category: string }[]> {
        try {
            const services = await this.serviceRepository.find({ 
                where: { CompanyId: companyId },
                select: ['Id', 'VcName', 'VcDescription', 'IRegularPrice', 'VcTime'],
                relations: ['Category']
            });
            
            return services.map(service => ({
                Id: service.Id,
                VcName: service.VcName,
                VcDescription: service.VcDescription,
                IRegularPrice: service.IRegularPrice,
                VcTime: service.VcTime,
                Category: service.Category?.VcName || 'Sin categoría'
            }));
        } catch (error) {
            throw error;
        }
    }
} 