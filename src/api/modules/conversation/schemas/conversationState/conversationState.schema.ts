import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type ConversationStateDocument = HydratedDocument<ConversationState>;

@Schema({ timestamps: true })
export class ConversationState {
  @Prop({ type: String, required: true, index: true })
  contactId: string;

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