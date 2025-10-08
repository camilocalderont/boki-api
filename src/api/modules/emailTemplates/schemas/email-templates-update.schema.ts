import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const updateEmailTemplatesSchema = Joi.object({
  CategoryName: Joi.string().min(3).max(255).optional(),
  ContextDescription: Joi.string().min(10).optional(),
  SearchKeywords: Joi.string().min(10).optional(),  
  CompanyId: Joi.number().integer().positive().optional()
}).messages(joiMessagesES);