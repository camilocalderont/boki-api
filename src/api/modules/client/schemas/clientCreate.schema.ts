import Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const createClientSchema = Joi.object({
  CompanyId: Joi.number().required(),
  VcIdentificationNumber: Joi.string().min(5).max(50).pattern(/^\d+$/).required()
    .messages({
      'string.pattern.base': 'El número de identificación debe contener solo dígitos'
    }),
  VcPhone: Joi.number().required()
    .messages({
      'string.pattern.base': 'El número de teléfono debe tener el formato 57 seguido de 10 dígitos (ej: 573102222012)'
    }),
  VcNickName: Joi.string().min(2).max(50).optional(),
  VcFirstName: Joi.string().min(2).max(50).required(),
  VcSecondName: Joi.string().min(2).max(50).optional(),
  VcFirstLastName: Joi.string().min(2).max(50).optional(),
  VcSecondLastName: Joi.string().min(2).max(50).optional(),
  VcEmail: Joi.string().email().optional(),
}).messages(joiMessagesES);
