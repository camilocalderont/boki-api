import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageHistoryDocument = HydratedDocument<MessageHistory>;

export enum MessageDirection {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound'
}

@Schema({ timestamps: true, versionKey: false })
export class MessageHistory {
  @Prop({ type: String, required: true })
  messageId: string;

  @Prop({ type: String })
  waMessageId?: string; 

  @Prop({ type: String, required: true })
  contactId: string;

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

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

export const MessageHistorySchema = SchemaFactory.createForClass(MessageHistory);

// Índices optimizados para nuestros queries
MessageHistorySchema.index({ contactId: 1, timestamp: -1 });
MessageHistorySchema.index({ messageId: 1 }, { unique: true });
MessageHistorySchema.index({ waMessageId: 1 });