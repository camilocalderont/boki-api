import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const updatePlanSchema = Joi.object({
  IValueMonthly: Joi.number().integer().min(0),
  IValueYearly: Joi.number().integer().min(0),
  ITime: Joi.number().integer().min(1),
  IMaxConversation: Joi.number().integer().min(1),
  TxProperties: Joi.string().allow('', null)
}).messages(joiMessagesES);