import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type ConversationStateDocument = HydratedDocument<ConversationState>;

@Schema({ timestamps: true, versionKey: false })
export class ConversationState {
  @Prop({ type: String, required: true, index: true })
  contactId: string;

  @Prop({ type: String, required: true })
  flow: string;

  @Prop({ type: String, required: true })
  step: string;

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  data: Record<string, any>;
}

export const ConversationStateSchema = SchemaFactory.createForClass(ConversationState); 