import Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const createCompanyPromptsSchema = Joi.object({
  CompanyId: Joi.number().integer().positive().required(),
  VcDescription: Joi.string().min(2).max(255).required(),
  VcInternalCode: Joi.string().min(2).max(100).required(),
  TxIntentionPrompt: Joi.string().min(10).required(),
  TxMainPrompt: Joi.string().min(10).required(),
  UserId: Joi.number().integer().positive().required()
}).messages(joiMessagesES);