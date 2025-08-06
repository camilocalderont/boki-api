import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

// Schema para json_flow_config
export const flowConfigSchema = Joi.object({
    max_steps: Joi.number().integer().min(1).max(50).optional(),
    timeout_minutes: Joi.number().integer().min(5).max(180).optional(),
    fallback_enabled: Joi.boolean().optional(),
    auto_advance: Joi.boolean().optional(),
    required_fields: Joi.array().items(Joi.string().max(100)).optional()
});

// Schema para json_llm_config  
export const llmConfigSchema = Joi.object({
    model: Joi.string().max(100).required(),
    temperature: Joi.number().min(0).max(2).required(),
    max_tokens: Joi.number().integer().min(50).max(4000).required(),
    top_p: Joi.number().min(0).max(1).optional(),
    personality: Joi.string().max(100).optional(),
    language: Joi.string().max(10).optional(),
    custom_instructions: Joi.string().max(500).optional()
});


// SCHEMAS PARA COMPANY FLOW DEFINITION
export const createCompanyFlowDefinitionSchema = Joi.object({
    vc_flow_name: Joi.string().min(1).max(100).required(),
    vc_display_name: Joi.string().min(1).max(150).required(),
    vc_description: Joi.string().max(1000).optional().allow('', null),
    tx_system_prompt: Joi.string().min(10).max(5000).required(),
    tx_user_prompt_template: Joi.string().min(10).max(5000).required(),
    json_flow_config: flowConfigSchema.required(),
    json_llm_config: llmConfigSchema.required(),
    b_is_active: Joi.boolean().default(true)
}).messages(joiMessagesES);

export const updateCompanyFlowDefinitionSchema = Joi.object({
    vc_flow_name: Joi.string().min(1).max(100).optional(),
    vc_display_name: Joi.string().min(1).max(150).optional(),
    vc_description: Joi.string().max(1000).optional().allow('', null),
    tx_system_prompt: Joi.string().min(10).max(5000).optional(),
    tx_user_prompt_template: Joi.string().min(10).max(5000).optional(),
    json_flow_config: flowConfigSchema.optional(),
    json_llm_config: llmConfigSchema.optional(),
    b_is_active: Joi.boolean().optional()
}).messages(joiMessagesES);