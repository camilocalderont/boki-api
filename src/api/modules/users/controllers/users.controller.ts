import { Controller, Inject, ValidationPipe, UsePipes, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UsersEntity } from '../entities/users.entity';
import { CreateUsersDto } from '../dto/usersCreate.dto';
import { UpdateUsersDto } from '../dto/usersUpdate.dto';
import { LoginUsersDto } from '../dto/usersLogin.dto';
import { CompanyEntity } from '../../company/entities/company.entity';
import { LoginResponse } from '../interfaces/auth.interface';
import { BaseCrudController } from '../../../shared/controllers/crud.controller';
import { createUsersSchema } from '../schemas/usersCreate.schema';
import { updateUsersSchema } from '../schemas/usersUpdate.schema';
import { loginUsersSchema } from '../schemas/usersLogin.schema';
import { JoiValidationPipe } from '../../../shared/pipes/joi-validation.pipe';
import { ApiControllerResponse } from '../../../shared/interfaces/api-response.interface';
import { Public } from '../../../shared/decorators/public.decorator'; // ← NUEVO IMPORT

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

  @Public() 
  @Post()
  async create(@Body() createUsersDto: CreateUsersDto): Promise<ApiControllerResponse<UsersEntity>> {
    const user = await this.usersService.create(createUsersDto);
    return {
      message: 'Usuario creado exitosamente',
      data: user
    };
  }
  
  @Public() 
  @Post('login')
  async login(
    @Body(new JoiValidationPipe(loginUsersSchema)) loginUsersDto: LoginUsersDto
  ): Promise<ApiControllerResponse<LoginResponse>> {
    const loginResult = await this.usersService.login(loginUsersDto);
    
    return {
      message: 'Inicio de sesión exitoso',
      data: loginResult
    };
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