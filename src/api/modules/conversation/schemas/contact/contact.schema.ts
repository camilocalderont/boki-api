import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type ContactDocument = HydratedDocument<Contact>;

@Schema({ timestamps: true, versionKey: false })
export class Contact {
  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: Date, default: Date.now })
  lastInteraction: Date;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
ContactSchema.index({ phone: 1 }, { unique: true });