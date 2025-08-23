import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UsersEntity } from './entities/users.entity';
import { UsersRepository } from './repositories/users.repository';
import { CompanyEntity } from '../company/entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity, CompanyEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'BokiBot2024_#SecureAPI&AuthToken$ChatBot!@#$%^&*()_+{}|:<>?[];\',./`~Authentication_Key_V1.0_Production_Ready',
        signOptions: {
          expiresIn: '2h',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule { }