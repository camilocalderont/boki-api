import * as Joi from 'joi';
import { joiMessagesES } from '../../../../shared/utils/joi-messages';
import { MessageDirection } from './messageHistory.schema';

export const createMessageHistorySchema = Joi.object({
  messageId: Joi.string().required(),
  contactId: Joi.string().required(),
  direction: Joi.string().valid(MessageDirection.INBOUND, MessageDirection.OUTBOUND).required(),
  content: Joi.object({
    type: Joi.string().required(),
    text: Joi.string().optional(),
    mediaUrl: Joi.string().optional(),
    mediaType: Joi.string().optional(),
    buttons: Joi.array().optional()
  }).required(),
  flowContext: Joi.object({
    flow: Joi.string().required(),
    step: Joi.string().required()
  }).optional()
}).messages(joiMessagesES);