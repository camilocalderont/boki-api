import * as Joi from 'joi';
import { joiMessagesES } from '../../../../shared/utils/joi-messages';

export const createContactSchema = Joi.object({
  phone: Joi.string().required()
}).unknown(false).messages({
  ...joiMessagesES,
  'object.unknown': 'El campo "{#label}" no está permitido'
});