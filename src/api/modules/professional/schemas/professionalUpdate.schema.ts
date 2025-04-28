import Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const professionalUpdateSchema = Joi.object({
  VcFirstName: Joi.string().min(3).max(100).allow('', null),
  VcSecondName: Joi.string().min(3).max(100).allow('', null),
  VcFirstLastName: Joi.string().min(3).max(100).allow('', null),
  VcSecondLastName: Joi.string().min(3).max(100).allow('', null),
  VcEmail: Joi.string().email().allow('', null),
  VcPhone: Joi.string().min(6).max(20).allow('', null),
  VcIdentificationNumber: Joi.string().min(6).max(20).allow('', null),
  VcLicenseNumber: Joi.string().min(6).max(50).allow('', null),
  IYearsOfExperience: Joi.number().integer().default(0),
  TxPhoto: Joi.string().optional(),
  VcProfession: Joi.string().min(3).max(100).allow('', null),
  VcSpecialization: Joi.string().min(3).max(100).allow('', null),
}).messages(joiMessagesES);
