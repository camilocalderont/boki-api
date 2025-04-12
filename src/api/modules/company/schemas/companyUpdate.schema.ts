import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const updateCompanySchema = Joi.object({
  VcName: Joi.string().required().min(3).max(100),
  VcDescription: Joi.string().required(),
  VcPhone: Joi.string().pattern(/^(3|6)\d{9}$/).required()
    .messages({
      'string.pattern.base': 'El número de teléfono debe tener 10 dígitos y comenzar con 3 (celular) o 6 (fijo)'
    }),
  VcPrincipalAddress: Joi.string().required(),
  VcPrincipalEmail: Joi.string().email().required(),
  VcLegalRepresentative: Joi.string().min(2).max(50).required(),
  VcLogo: Joi.string().required(),
  TxImages: Joi.string().required()
}).messages(joiMessagesES);
