import * as Joi from 'joi';
import { joiMessagesES } from '../../../../shared/utils/joi-messages';

export const updateContactSchema = Joi.object({
  phone: Joi.string().required(),
  lastInteraction: Joi.date().optional()
}).unknown(false).messages({
  ...joiMessagesES,
  'object.unknown': 'El campo "{#label}" no está permitido'
});