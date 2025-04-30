import { Controller, Inject, ValidationPipe, UsePipes } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UsersEntity } from '../entities/users.entity';
import { CreateUsersDto } from '../dto/usersCreate.dto';
import { UpdateUsersDto } from '../dto/usersUpdate.dto';
import { BaseCrudController } from '../../../shared/controllers/crud.controller';
import { createUsersSchema } from '../schemas/usersCreate.schema';
import { updateUsersSchema } from '../schemas/usersUpdate.schema';

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
}