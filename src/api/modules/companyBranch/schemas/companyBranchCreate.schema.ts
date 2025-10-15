import Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';
import { createCompanyBranchRoomSchema } from './companyBranchRoomCreate.schema';

export const createCompanyBranchSchema = Joi.object({
  CompanyId: Joi.number().integer().positive().required(),
  VcName: Joi.string().min(3).max(100).required(),
  VcDescription: Joi.string().min(3).max(255).allow('', null),
  VcAddress: Joi.string().min(5).max(150).required(),
  VcEmail: Joi.string().email().required(),
  VcPhone: Joi.string().min(6).max(20).allow('', null),
  VcBranchManagerName: Joi.string().min(3).max(100).allow('', null),
  VcImage: Joi.string().uri().allow('', null)
    .messages({
      'string.uri': 'La URL de la imagen debe tener un formato válido'
    }),
  BIsPrincipal: Joi.boolean().default(false),
  CompanyBranchRoom: Joi.alternatives().try(
    Joi.array().items(createCompanyBranchRoomSchema)
  ).optional()
}).messages(joiMessagesES);
