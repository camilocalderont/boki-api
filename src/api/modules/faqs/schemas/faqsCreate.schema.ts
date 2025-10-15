import Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const createFaqsSchema = Joi.object({
  VcQuestion: Joi.string().min(2).max(500).required(),
  VcAnswer: Joi.string().required(),
  CompanyId: Joi.number().integer().positive().required(),
  CategoryServiceId: Joi.number().integer().positive().required(),
}).messages(joiMessagesES);
