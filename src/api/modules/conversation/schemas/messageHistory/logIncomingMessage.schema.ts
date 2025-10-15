import Joi from 'joi';
import { joiMessagesES } from '../../../../shared/utils/joi-messages';

export const logIncomingMessageSchema = Joi.object({
  contactId: Joi.string().required(),
  messageId: Joi.string().required(),
  text: Joi.string().required(),
  flowContext: Joi.object({
    flow: Joi.string().required(),
    step: Joi.string().required()
  }).optional()
}).unknown(false).messages({
  ...joiMessagesES,
  'object.unknown': 'El campo "{#label}" no está permitido'
}); 