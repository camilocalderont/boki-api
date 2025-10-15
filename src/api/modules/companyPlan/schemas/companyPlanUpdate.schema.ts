import Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const updateCompanyPlanSchema = Joi.object({
  CompanyId: Joi.number().integer().positive(),
  PlanId: Joi.number().integer().positive()
}).messages(joiMessagesES);