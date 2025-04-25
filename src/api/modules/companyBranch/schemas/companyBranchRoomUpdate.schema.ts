import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const updateCompanyBranchRoomSchema = Joi.object({
  Id: Joi.number().integer().positive().optional(),
  CompanyBranchId: Joi.number().integer().positive(),
  VcNumber: Joi.string().min(1).max(100),
  VcFloor: Joi.string().min(1).max(100).allow('', null),
  VcTower: Joi.string().min(1).max(100).allow('', null),
  VcPhone: Joi.string().min(6).max(20).allow('', null),
  VcEmail: Joi.string().email().allow('', null),
  BIsMain: Joi.boolean()
}).messages(joiMessagesES);
