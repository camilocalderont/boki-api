import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const updateServiceStageSchema = Joi.object({
  ISequence: Joi.number().integer().min(1).required(),
  IDurationMinutes: Joi.number().integer().min(1).required(),
  VcDescription: Joi.string().max(500).allow(null, ''),
  BIsProfessionalBussy: Joi.boolean().required(),
  BIsActive: Joi.boolean().default(true)
}).messages(joiMessagesES);