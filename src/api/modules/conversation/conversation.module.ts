import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactController } from './controllers/contact.controller';
import { ConversationStateController } from './controllers/conversationState.controller';
import { MessageHistoryController } from './controllers/messageHistory.controller';
import { SystemEventController } from './controllers/systemEvent.controller';
import { ContactService } from './services/contact.service';
import { ConversationStateService } from './services/conversationState.service';
import { MessageHistoryService } from './services/messageHistory.service';
import { SystemEventService } from './services/systemEvent.service';
import { Contact, ContactSchema } from './schemas/contact/contact.schema';
import { ConversationState, ConversationStateSchema } from './schemas/conversationState/conversationState.schema';
import { MessageHistory, MessageHistorySchema } from './schemas/messageHistory/messageHistory.schema';
import { SystemEvent, SystemEventSchema } from './schemas/systemEvent/systemEvent.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contact.name, schema: ContactSchema },
      { name: ConversationState.name, schema: ConversationStateSchema },
      { name: MessageHistory.name, schema: MessageHistorySchema },
      { name: SystemEvent.name, schema: SystemEventSchema }
    ]),
  ],
  controllers: [
    ContactController,
    ConversationStateController,
    MessageHistoryController,
    SystemEventController
  ],
  providers: [
    {
      provide: 'ContactService',
      useClass: ContactService
    },
    {
      provide: 'ConversationStateService',
      useClass: ConversationStateService
    },
    {
      provide: 'MessageHistoryService',
      useClass: MessageHistoryService
    },
    {
      provide: 'SystemEventService',
      useClass: SystemEventService
    }
  ],
  exports: [
    'ContactService',
    'ConversationStateService',
    'MessageHistoryService',
    'SystemEventService'
  ],
})
export class ConversationModule {}
