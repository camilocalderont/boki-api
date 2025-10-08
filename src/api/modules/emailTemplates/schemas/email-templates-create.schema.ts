import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const createEmailTemplatesSchema = Joi.object({
  CategoryName: Joi.string().min(3).max(255).required(),
  ContextDescription: Joi.string().min(10).required(),
  SearchKeywords: Joi.string().min(10).required(), 
  CompanyId: Joi.number().integer().positive().required()
}).messages(joiMessagesES);