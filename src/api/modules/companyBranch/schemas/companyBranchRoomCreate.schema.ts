import Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const createCompanyBranchRoomSchema = Joi.object({
  VcNumber: Joi.string().min(1).max(100).required(),
  VcFloor: Joi.string().min(1).max(100).allow('', null),
  VcTower: Joi.string().min(1).max(100).allow('', null),
  VcPhone: Joi.string().min(6).max(20).allow('', null),
  VcEmail: Joi.string().email().allow('', null),
  BIsMain: Joi.boolean().required()
}).messages(joiMessagesES);
