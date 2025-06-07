import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from '../schemas/contact/contact.schema';
import { CreateContactDto } from '../dto/contact/createContact.dto';
import { UpdateContactDto } from '../dto/contact/updateContact.dto';
import { BaseMongoDbCrudService } from '../../../shared/services/mongo-crud.service';

@Injectable()
export class ContactService extends BaseMongoDbCrudService<ContactDocument, CreateContactDto, UpdateContactDto> {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>
  ) {
    super(contactModel);
    this.logger.log('ContactService initialized');
  }

  async findByPhone(phone: string): Promise<ContactDocument> {
    const doc = await this.contactModel.findOne({ phone }).lean().exec();
    return this.transformMongoDocument(doc);
  }
}