import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const updateServiceSchema = Joi.object({
  VcName: Joi.string().min(3).max(100).optional(),
  VcDescription: Joi.string().max(500).optional(),
  IMinimalPrice: Joi.number().integer().min(0).optional(),
  IMaximalPrice: Joi.number().integer().min(0).optional(),
  IRegularPrice: Joi.number().integer().min(0).optional(),
  DTaxes: Joi.number().precision(2).min(0).max(100).optional(),
  VcTime: Joi.string().pattern(/^([0-9]{1,2}):([0-5][0-9])$/).optional(),
  CompanyId: Joi.number().integer().positive().optional(),
  CategoryId: Joi.number().integer().positive().optional(),
  TxPicture: Joi.string().optional()
}).messages(joiMessagesES);
