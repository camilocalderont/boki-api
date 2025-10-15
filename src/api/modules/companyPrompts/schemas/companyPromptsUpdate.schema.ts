import Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const updateCompanyPromptsSchema = Joi.object({
  CompanyId: Joi.number().integer().positive(),
  VcDescription: Joi.string().min(2).max(255),
  VcInternalCode: Joi.string().min(2).max(100),
  TxIntentionPrompt: Joi.string().min(10),
  TxMainPrompt: Joi.string().min(10),
  UserId: Joi.number().integer().positive()
}).messages(joiMessagesES);