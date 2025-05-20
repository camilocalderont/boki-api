import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { ContactDocument } from '../contact/contact.schema';

export type SystemEventDocument = HydratedDocument<SystemEvent>;

@Schema({ timestamps: true })
export class SystemEvent {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true, index: true })
  contactId: ContactDocument;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  data: Record<string, any>;

  @Prop({ type: Date, default: Date.now, index: true })
  timestamp: Date;
}

export const SystemEventSchema = SchemaFactory.createForClass(SystemEvent);
SystemEventSchema.index({ contactId: 1, timestamp: -1 });
SystemEventSchema.index({ type: 1, timestamp: -1 });