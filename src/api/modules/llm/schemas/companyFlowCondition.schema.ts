import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

// SCHEMAS PARA COMPANY FLOW CONDITION
export const createCompanyFlowConditionSchema = Joi.object({
    vc_condition_key: Joi.string().min(1).max(100).required(),
    vc_condition_name: Joi.string().min(1).max(150).required(),
    tx_condition_expression: Joi.string().min(1).max(2000).required(),
    vc_condition_type: Joi.string().max(50).default('computed'),
    b_is_active: Joi.boolean().default(true)
}).messages(joiMessagesES);

export const updateCompanyFlowConditionSchema = Joi.object({
    vc_condition_key: Joi.string().min(1).max(100).optional(),
    vc_condition_name: Joi.string().min(1).max(150).optional(),
    tx_condition_expression: Joi.string().min(1).max(2000).optional(),
    vc_condition_type: Joi.string().max(50).optional(),
    b_is_active: Joi.boolean().optional()
}).messages(joiMessagesES);
