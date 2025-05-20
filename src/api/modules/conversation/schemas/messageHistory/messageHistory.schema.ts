import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { ContactDocument } from '../contact/contact.schema';

export type MessageHistoryDocument = HydratedDocument<MessageHistory>;

export enum MessageDirection {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound'
}

@Schema({ timestamps: true })
export class MessageHistory {
  @Prop({ type: String, required: true, unique: true, index: true })
  messageId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true, index: true })
  contactId: ContactDocument;

  @Prop({ type: String, required: true, enum: MessageDirection })
  direction: MessageDirection;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  content: {
    type: string;
    text?: string;
    mediaUrl?: string;
    mediaType?: string;
    buttons?: any[];
  };

  @Prop({ type: MongooseSchema.Types.Mixed })
  flowContext: {
    flow: string;
    step: string;
  };

  @Prop({ type: Date, default: Date.now, index: true })
  timestamp: Date;
}

export const MessageHistorySchema = SchemaFactory.createForClass(MessageHistory);
MessageHistorySchema.index({ contactId: 1, timestamp: -1 });
MessageHistorySchema.index({ messageId: 1 }, { unique: true });