import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

// SCHEMAS PARA JSON CONFIGS DE STEPS

// Schema para json_expected_data
export const expectedDataSchema = Joi.object({
    extract_fields: Joi.array().items(Joi.string().max(100)).optional(),
    required_fields: Joi.array().items(Joi.string().max(100)).optional(),
    validation_rules: Joi.object().optional()
}).optional();

// Schema para json_step_config
export const stepConfigSchema = Joi.object({
    use_ai_generation: Joi.boolean().optional(),
    show_service_list: Joi.boolean().optional(),
    show_professional_list: Joi.boolean().optional(),
    show_calendar: Joi.boolean().optional(),
    auto_advance_when_complete: Joi.boolean().optional(),
    next_step_on_success: Joi.string().max(100).optional(),
    fallback_message: Joi.string().max(500).optional(),
    max_suggestions: Joi.number().integer().min(1).max(20).optional()
}).optional();


// SCHEMAS PARA COMPANY FLOW STEP
export const createCompanyFlowStepSchema = Joi.object({
    vc_step_key: Joi.string().min(1).max(100).required(),
    vc_step_name: Joi.string().min(1).max(150).required(),
    i_step_order: Joi.number().integer().min(1).max(100).required(),
    tx_execution_condition: Joi.string().min(1).max(2000).required(),
    tx_step_output: Joi.string().min(1).max(5000).required(),
    json_expected_data: expectedDataSchema,
    json_step_config: stepConfigSchema,
    b_is_active: Joi.boolean().default(true)
}).messages(joiMessagesES);

export const updateCompanyFlowStepSchema = Joi.object({
    vc_step_key: Joi.string().min(1).max(100).optional(),
    vc_step_name: Joi.string().min(1).max(150).optional(),
    i_step_order: Joi.number().integer().min(1).max(100).optional(),
    tx_execution_condition: Joi.string().min(1).max(2000).optional(),
    tx_step_output: Joi.string().min(1).max(5000).optional(),
    json_expected_data: expectedDataSchema,
    json_step_config: stepConfigSchema,
    b_is_active: Joi.boolean().optional()
}).messages(joiMessagesES);
