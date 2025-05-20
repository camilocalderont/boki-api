import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from '../schemas/contact/contact.schema';
import { CreateContactDto } from '../dto/contact/createContact.dto';
import { UpdateContactDto } from '../dto/contact/updateContact.dto';
import { BaseMongoDbCrudService } from '../../../shared/services/mongo-crud.service';
import { PaginatedResponse, PaginationOptions } from '../../../shared/interfaces/mongo-pagination.interface';

@Injectable()
export class ContactService extends BaseMongoDbCrudService<ContactDocument, CreateContactDto, UpdateContactDto> {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>
  ) {
    super(contactModel);
    this.logger.log('ContactService initialized');
  }

  // Sobrescribir create para devolver objeto limpio
  override async create(createDto: CreateContactDto): Promise<ContactDocument> {
    try {
      await this.validateCreate(createDto);

      const entity = new this.contactModel(createDto);
      const savedEntity = await entity.save();
      
      await this.afterCreate(savedEntity);
      
      // Convertir a objeto limpio y devolver
      const doc = await this.contactModel.findById(savedEntity._id).lean().exec();
      return this.transformMongoDocument(doc);
    } catch (error) {
      this.logger.error(`Error in create:`, error);
      
      if (error.code === 11000) {
        throw new ConflictException('Ya existe un registro con estos datos');
      }
      
      throw error;
    }
  }

  // Sobrescribir findOne para usar lean
  override async findOne(id: string): Promise<ContactDocument> {
    try {
      const entity = await this.contactModel.findById(id).lean().exec();
      if (!entity) {
        throw new NotFoundException(`Contacto con ID ${id} no encontrado`);
      }
      return this.transformMongoDocument(entity);
    } catch (error) {
      this.logger.error(`Error in findOne:`, error);
      throw error;
    }
  }

  // Sobrescribir update para usar lean
  override async update(id: string, updateDto: UpdateContactDto): Promise<ContactDocument> {
    try {
      await this.validateUpdate(id, updateDto);

      const entity = await this.findOne(id);
      if (!entity) {
        throw new NotFoundException(`Contacto con ID ${id} no encontrado`);
      }
      
      const preparedData = await this.prepareUpdateData(entity, updateDto);
      
      await this.contactModel.findByIdAndUpdate(id, preparedData).exec();
      await this.afterUpdate(await this.contactModel.findById(id).exec());
      
      // Obtener y retornar el documento actualizado como objeto plano
      const updated = await this.contactModel.findById(id).lean().exec();
      return this.transformMongoDocument(updated);
    } catch (error) {
      this.logger.error(`Error in update:`, error);
      throw error;
    }
  }

  async findByPhone(phone: string): Promise<ContactDocument> {
    const doc = await this.contactModel.findOne({ phone }).lean().exec();
    return this.transformMongoDocument(doc);
  }

  async updateLastInteraction(id: string): Promise<void> {
    await this.contactModel
      .findByIdAndUpdate(id, { lastInteraction: new Date() })
      .exec();
  }

  async getOrCreateContact(phone: string, clientId?: number): Promise<ContactDocument> {
    let contact = await this.findByPhone(phone);
    if (!contact) {
      contact = await this.create({ 
        phone, 
        clientId,
        metadata: { registered: !!clientId }
      });
    } else if (clientId && !contact.clientId) {
      // Update the contact with clientId if provided and not already set
      contact = await this.update(contact._id.toString(), { 
        clientId, 
        metadata: { ...contact.metadata, registered: true }
      });
    }
    return contact;
  }

  // Sobrescribir el método findAll para usar lean() y devolver objetos planos
  override async findAll(filters?: Record<string, any>): Promise<ContactDocument[]> {
    try {
      const results = await this.contactModel.find(filters || {}).lean().exec();
      
      // Transformar los datos para que sean más amigables en la API
      return results.map(doc => this.transformMongoDocument(doc));
    } catch (error) {
      this.logger.error(`Error in findAll:`, error);
      throw error;
    }
  }

  // Método para transformar documentos MongoDB para API
  private transformMongoDocument(doc: any): any {
    if (!doc) return null;
    
    // Crear un nuevo objeto con las propiedades transformadas
    const transformed = { ...doc };
    
    // Convertir ObjectId a string
    if (transformed._id) {
      transformed._id = transformed._id.toString();
    }
    
    // Asegurar que las fechas sean strings en formato ISO
    if (transformed.lastInteraction && transformed.lastInteraction instanceof Date) {
      transformed.lastInteraction = transformed.lastInteraction.toISOString();
    }
    
    if (transformed.createdAt && transformed.createdAt instanceof Date) {
      transformed.createdAt = transformed.createdAt.toISOString();
    }
    
    if (transformed.updatedAt && transformed.updatedAt instanceof Date) {
      transformed.updatedAt = transformed.updatedAt.toISOString();
    }
    
    return transformed;
  }

  // Sobrescribir el método findAllPaginated para usar lean() y devolver objetos planos
  async findAllPaginated(
    options: PaginationOptions = { page: 1, limit: 10 },
    filters?: Record<string, any>
  ): Promise<PaginatedResponse<ContactDocument>> {
    try {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const skip = (page - 1) * limit;
      const sort = options.sort || { createdAt: -1 };

      const [items, totalItems] = await Promise.all([
        this.contactModel
          .find(filters || {})
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
        this.contactModel.countDocuments(filters || {}).exec()
      ]);

      // Transformar los documentos para la API
      const transformedItems = items.map(item => this.transformMongoDocument(item));

      return {
        items: transformedItems,
        meta: {
          totalItems,
          itemCount: items.length,
          itemsPerPage: limit,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: page
        }
      };
    } catch (error) {
      this.logger.error(`Error in findAllPaginated:`, error);
      throw error;
    }
  }
}