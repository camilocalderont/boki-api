import Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const updateProfessionalBussinessHourSchema = Joi.object({
  IDayOfWeek: Joi.number().integer().min(0).max(6).required(),
  TStartTime: Joi.date().required(),
  TEndTime: Joi.date().required(),
  TBreakStartTime: Joi.date().allow(null),
  TBreakEndTime: Joi.date().allow(null),
  VcNotes: Joi.string().max(255).allow('', null),
  CompanyBranchRoomId: Joi.number().integer().required()
}).messages(joiMessagesES);