import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';
export const updateClientSchema = Joi.object({
  VcIdentificationNumber: Joi.string().min(5).max(50).required(),
  VcPhone: Joi.string().pattern(/^(3|6)\d{9}$/).required()
  .messages({
    'string.pattern.base': 'El número de teléfono debe tener 10 dígitos y comenzar con 3 (celular) o 6 (fijo)'
  }),
  VcNickName: Joi.string().min(2).max(50),
  VcFirstName: Joi.string().min(2).max(50).required(),
  VcSecondName: Joi.string().min(2).max(50).allow('', null),
  VcFirstLastName: Joi.string().min(2).max(50).required(),
  VcSecondLastName: Joi.string().min(2).max(50).allow('', null),
  VcEmail: Joi.string().email().required(),
  VcPassword: Joi.string().min(8)
}).messages(joiMessagesES);
