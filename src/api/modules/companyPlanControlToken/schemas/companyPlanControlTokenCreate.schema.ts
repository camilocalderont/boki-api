import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const createCompanyPlanControlTokenSchema = Joi.object({
  CompanyPlanId: Joi.number().integer().positive().required(),
  IYear: Joi.number().integer().min(2020).max(2050).required(),
  IMonth: Joi.number().integer().min(1).max(12).required(),
  IMaxInteractionTokens: Joi.number().integer().min(0).required(),
  IMaxConversationTokens: Joi.number().integer().min(0).required()
}).messages(joiMessagesES);