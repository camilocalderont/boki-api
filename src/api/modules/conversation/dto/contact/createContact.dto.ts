import { ContactMetadataDto } from './contactMetadata.dto';

export class CreateContactDto {
    phone: string;
    clientId?: number;
    metadata?: ContactMetadataDto;
} 