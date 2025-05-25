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

export enum MessageStatus {
  PENDING = 'pending',
  PROCESSING = 'processing', 
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
  EXPIRED = 'expired'
}

export enum DeliveryStatus {
  UNKNOWN = 'unknown',
  SENT = 'sent',
  DELIVERED = 'delivered', 
  READ = 'read',
  FAILED = 'failed'
}

@Schema({ timestamps: true })
export class MessageHistory {
  @Prop({ type: String, required: true, unique: true, index: true })
  messageId: string;

  @Prop({ type: String, index: true })
  waMessageId?: string; 

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
  flowContext?: {
    flow: string;
    step: string;
  };

  @Prop({ type: String, enum: MessageStatus, default: MessageStatus.PENDING, index: true })
  messageStatus: MessageStatus;

  @Prop({ type: String, enum: DeliveryStatus, default: DeliveryStatus.UNKNOWN, index: true })
  deliveryStatus: DeliveryStatus;

  @Prop({ type: String })
  errorCode?: string;

  @Prop({ type: String })
  errorMessage?: string;

  @Prop({ type: Number, default: 0 })
  retryCount: number;

  @Prop({ type: Number, default: 3 })
  maxRetries: number;

  @Prop({ type: Date, index: true })
  nextRetryAt?: Date;

  @Prop({ type: Date, default: Date.now, index: true })
  timestamp: Date;

  @Prop({ type: Date })
  deliveredAt?: Date;

  @Prop({ type: Date })
  readAt?: Date;
}

export const MessageHistorySchema = SchemaFactory.createForClass(MessageHistory);

MessageHistorySchema.index({ contactId: 1, timestamp: -1 });
MessageHistorySchema.index({ messageId: 1 }, { unique: true });
MessageHistorySchema.index({ messageStatus: 1, nextRetryAt: 1 });
MessageHistorySchema.index({ waMessageId: 1 });
MessageHistorySchema.index({ deliveryStatus: 1, direction: 1 });