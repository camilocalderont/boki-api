import { Controller, Get, Post, Body, Param, UseGuards, NotFoundException, Query, Inject } from '@nestjs/common';
import { ContactService } from '../services/contact.service';
import { CreateContactDto } from '../dto/contact/createContact.dto';
import { UpdateContactDto } from '../dto/contact/updateContact.dto';
import { ApiTokenGuard } from '../../../shared/utils/api-token.guard';
import { BaseMongoDbCrudController } from '../../../shared/controllers/mongo-crud.controller';
import { createContactSchema } from '../schemas/contact/createContact.schema';
import { updateContactSchema } from '../schemas/contact/updateContact.schema';
import { Contact, ContactDocument } from '../schemas/contact/contact.schema';
import { ApiControllerResponse } from '../../../shared/interfaces/api-response.interface';

@Controller('contacts')
@UseGuards(ApiTokenGuard)
export class ContactController extends BaseMongoDbCrudController<ContactDocument, CreateContactDto, UpdateContactDto> {
  constructor(
    @Inject('ContactService') 
    private readonly contactService: ContactService
  ) {
    super(contactService, 'contact', createContactSchema, updateContactSchema);
  }

  @Get('phone/:phone')
  async findByPhone(@Param('phone') phone: string): Promise<ApiControllerResponse<any>> {
    const contact = await this.contactService.findByPhone(phone);
    if (!contact) {
      throw new NotFoundException(`Contact with phone ${phone} not found`);
    }

    // Filtrar los datos para retornar solo los campos específicos
    const contactObj = contact.toObject ? contact.toObject() : contact;
    const filteredData = {
      _id: contactObj._id,
      phone: contactObj.phone,
      lastInteraction: contactObj.lastInteraction
    };

    return {
      message: 'Contact retrieved successfully',
      data: filteredData
    };
  }
}