import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type ContactDocument = HydratedDocument<Contact>;

@Schema({ timestamps: true })
export class Contact {
  @Prop({ type: String, required: true, unique: true, index: true })
  phone: string;

  @Prop({ type: Number, ref: 'Client' })
  clientId: number;

  @Prop({ type: Date, default: Date.now })
  lastInteraction: Date;

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata: Record<string, any>;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
ContactSchema.index({ phone: 1 });