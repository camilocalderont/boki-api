import { Controller, Inject, ValidationPipe, UsePipes, Get, Post, Body, Param, ParseIntPipe, Request } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UsersEntity } from '../entities/users.entity';
import { CreateUsersDto } from '../dto/usersCreate.dto';
import { UpdateUsersDto } from '../dto/usersUpdate.dto';
import { LoginUsersDto } from '../dto/usersLogin.dto';
import { CompanyEntity } from '../../company/entities/company.entity';
import { LoginResponse, TokenValidationResponse } from '../interfaces/auth.interface';
import { BaseCrudController } from '../../../shared/controllers/crud.controller';
import { createUsersSchema } from '../schemas/usersCreate.schema';
import { updateUsersSchema } from '../schemas/usersUpdate.schema';
import { loginUsersSchema } from '../schemas/usersLogin.schema';
import { JoiValidationPipe } from '../../../shared/pipes/joi-validation.pipe';
import { ApiControllerResponse } from '../../../shared/interfaces/api-response.interface';
import { Public } from '../../../shared/decorators/public.decorator';
import { AuthenticatedRequest } from '../../../shared/guards/jwt-auth.guard';
import * as jwt from 'jsonwebtoken';

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

  @Get('validate-token')
  async validateToken(@Request() req: AuthenticatedRequest): Promise<ApiControllerResponse<TokenValidationResponse>> {
    const token = this.extractTokenFromHeader(req);
    const decodedToken = jwt.decode(token) as any;
    
    const now = Math.floor(Date.now() / 1000); 
    const expiresIn = decodedToken.exp - now; 
    const expiresInMinutes = Math.floor(expiresIn / 60); 
    
    return {
      message: 'Token validado exitosamente',
      data: {
        isValid: true,
        expiresAt: new Date(decodedToken.exp * 1000),
        expiresIn: expiresIn,
        expiresInMinutes: expiresInMinutes,
        shouldRenew: expiresIn < 600,
        user: {
          userId: req.user.userId,
          email: req.user.email    
        }
      }
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

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}