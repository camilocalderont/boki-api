import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const updateCompanyPlanControlTokenSchema = Joi.object({
  CompanyPlanId: Joi.number().integer().positive(),
  IYear: Joi.number().integer().min(2020).max(2050),
  IMonth: Joi.number().integer().min(1).max(12),
  IMaxInteractionTokens: Joi.number().integer().min(0),
  IMaxConversationTokens: Joi.number().integer().min(0)
}).messages(joiMessagesES);