import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../../shared/services/crud.services';
import { CompanyWhatsappSettingEntity } from "../entities/companyWhatsappSetting.entity";
import { CreateCompanyWhatsappSettingDto } from "../dto/createCompanyWhatsappSetting.dto";
import { UpdateCompanyWhatsappSettingDto } from "../dto/updateCompanyWhatsappSetting.dto";

@Injectable()
export class CompanyWhatsappSettingService extends BaseCrudService<CompanyWhatsappSettingEntity, CreateCompanyWhatsappSettingDto, UpdateCompanyWhatsappSettingDto> {
    constructor(
        @InjectRepository(CompanyWhatsappSettingEntity)
        private readonly companyWhatsappSettingRepository: Repository<CompanyWhatsappSettingEntity>
    ) {
        super(companyWhatsappSettingRepository);
    }

    async findByCompany(companyId: number): Promise<CompanyWhatsappSettingEntity[]> {
        return this.companyWhatsappSettingRepository.find({
            where: { CompanyId: companyId },
            relations: ['Company']
        });
    }
}