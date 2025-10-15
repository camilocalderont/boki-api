import Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const createPlanSchema = Joi.object({
  IValueMonthly: Joi.number().integer().min(0).required(),
  IValueYearly: Joi.number().integer().min(0).required(),
  ITime: Joi.number().integer().min(1).required(),
  IMaxConversation: Joi.number().integer().min(1).required(),
  TxProperties: Joi.string().allow('', null)
}).messages(joiMessagesES);