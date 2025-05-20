import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { ContactDocument } from '../contact/contact.schema';

export type ConversationStateDocument = HydratedDocument<ConversationState>;

@Schema({ timestamps: true })
export class ConversationState {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true, index: true })
  contactId: ContactDocument;

  @Prop({ type: String, required: true })
  flow: string;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  state: Record<string, any>;

  @Prop({ type: Date, index: true })
  expiresAt: Date;
}

export const ConversationStateSchema = SchemaFactory.createForClass(ConversationState);
ConversationStateSchema.index({ contactId: 1 });
ConversationStateSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); 