import { Controller, Inject, ValidationPipe, UsePipes, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UsersEntity } from '../entities/users.entity';
import { CreateUsersDto } from '../dto/usersCreate.dto';
import { UpdateUsersDto } from '../dto/usersUpdate.dto';
import { CompanyEntity } from '../../company/entities/company.entity';
import { BaseCrudController } from '../../../shared/controllers/crud.controller';
import { createUsersSchema } from '../schemas/usersCreate.schema';
import { updateUsersSchema } from '../schemas/usersUpdate.schema';
import { ApiControllerResponse } from '../../../shared/interfaces/api-response.interface';

@Controller('users')
@UsePipes(new ValidationPipe({
  transform: true,
  forbidNonWhitelisted: true,
  transformOptions: { enableImplicitConversion: true }
}))
export class UsersController extends BaseCrudController<UsersEntity, CreateUsersDto, UpdateUsersDto> {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService
  ) {
    super(usersService, 'users', createUsersSchema, updateUsersSchema);
  }

  @Get(':id/companies')
  async getUserCompanies(@Param('id', ParseIntPipe) id: number): Promise<ApiControllerResponse<CompanyEntity[]>> {
    const companies = await this.usersService.getUserCompanies(id);
    return {
      message: 'Empresas del usuario obtenidas exitosamente',
      data: companies
    };
  }

  @Get(':id/with-companies')
  async getUserWithCompanies(@Param('id', ParseIntPipe) id: number): Promise<ApiControllerResponse<UsersEntity>> {
    const user = await this.usersService.findUserWithCompanies(id);
    return {
      message: 'Usuario con empresas obtenido exitosamente',
      data: user
    };
  }
}