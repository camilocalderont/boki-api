import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

// SCHEMAS PARA JSON CONFIGS DE TOOLS
export const toolConfigSchema = Joi.object({
    method: Joi.string().max(20).optional(),
    endpoint: Joi.string().max(500).optional(),
    prompt_template: Joi.string().max(2000).optional(),
    max_tokens: Joi.number().integer().min(50).max(4000).optional(),
    temperature: Joi.number().min(0).max(2).optional(),
    params: Joi.object().optional(),
    payload: Joi.object().optional(),
    cache_duration: Joi.number().integer().min(0).max(3600).optional(),
    response_mapping: Joi.object().optional(),
    success_message: Joi.string().max(300).optional(),
    error_fallback: Joi.string().max(300).optional(),
    include_context: Joi.array().items(Joi.string().max(100)).optional()
});

// SCHEMAS PARA COMPANY FLOW TOOL
export const createCompanyFlowToolSchema = Joi.object({
    vc_tool_type: Joi.string().min(1).max(100).required(),
    vc_tool_name: Joi.string().min(1).max(150).required(),
    json_tool_config: toolConfigSchema.required(),
    tx_usage_condition: Joi.string().max(1000).optional().allow('', null),
    b_is_active: Joi.boolean().default(true)
}).messages(joiMessagesES);

export const updateCompanyFlowToolSchema = Joi.object({
    vc_tool_type: Joi.string().min(1).max(100).optional(),
    vc_tool_name: Joi.string().min(1).max(150).optional(),
    json_tool_config: toolConfigSchema.optional(),
    tx_usage_condition: Joi.string().max(1000).optional().allow('', null),
    b_is_active: Joi.boolean().optional()
}).messages(joiMessagesES);
