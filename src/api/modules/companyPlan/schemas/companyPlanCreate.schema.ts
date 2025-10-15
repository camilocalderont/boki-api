import Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const createCompanyPlanSchema = Joi.object({
  CompanyId: Joi.number().integer().positive().required(),
  PlanId: Joi.number().integer().positive().required()
}).messages(joiMessagesES);