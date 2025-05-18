import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';
export const updateClientSchema = Joi.object({
  VcIdentificationNumber: Joi.string().min(5).max(50).required(),
  VcPhone: Joi.string().pattern(/^57\d{10}$/).required()
  .messages({
    'string.pattern.base': 'El número de teléfono debe tener el formato 57 seguido de 10 dígitos (ej: 573102222012)'
  }),
  VcNickName: Joi.string().min(2).max(50),
  VcFirstName: Joi.string().min(2).max(50).required(),
  VcSecondName: Joi.string().min(2).max(50).allow('', null),
  VcFirstLastName: Joi.string().min(2).max(50).required(),
  VcSecondLastName: Joi.string().min(2).max(50).allow('', null),
  VcEmail: Joi.string().email().required()
}).messages(joiMessagesES);
