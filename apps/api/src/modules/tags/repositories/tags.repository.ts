import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagsEntity } from '../entities/tags.entity';

@Injectable()
export class TagsRepository {
  constructor(
    @InjectRepository(TagsEntity)
    private readonly userRepository: Repository<TagsEntity>,
  ) {}

}
