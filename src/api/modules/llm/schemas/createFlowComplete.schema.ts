import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';
import { flowConfigSchema, llmConfigSchema } from './companyFlowDefinition.schema';
import { expectedDataSchema, stepConfigSchema } from './companyFlowStep.schema';
import { toolConfigSchema } from './companyFlowTool.schema';

// SCHEMA PARA CREAR FLUJO COMPLETO
export const createFlowCompleteSchema = Joi.object({
    // Definición principal del flujo
    vc_flow_name: Joi.string().min(1).max(100).required(),
    vc_display_name: Joi.string().min(1).max(150).required(),
    vc_description: Joi.string().max(1000).optional().allow('', null),
    tx_system_prompt: Joi.string().min(10).max(5000).required(),
    tx_user_prompt_template: Joi.string().min(10).max(5000).required(),
    json_flow_config: flowConfigSchema.required(),
    json_llm_config: llmConfigSchema.required(),
    b_is_active: Joi.boolean().default(true),

    // Componentes del flujo (opcional)
    steps: Joi.array().items(Joi.object({
        vc_step_key: Joi.string().min(1).max(100).required(),
        vc_step_name: Joi.string().min(1).max(150).required(),
        i_step_order: Joi.number().integer().min(1).max(100).required(),
        tx_execution_condition: Joi.string().min(1).max(2000).required(),
        tx_step_output: Joi.string().min(1).max(5000).required(),
        json_expected_data: expectedDataSchema,
        json_step_config: stepConfigSchema,
        b_is_active: Joi.boolean().default(true)
    })).max(20).optional(), // Máximo 20 pasos

    conditions: Joi.array().items(Joi.object({
        vc_condition_key: Joi.string().min(1).max(100).required(),
        vc_condition_name: Joi.string().min(1).max(150).required(),
        tx_condition_expression: Joi.string().min(1).max(2000).required(),
        vc_condition_type: Joi.string().max(50).default('computed'),
        b_is_active: Joi.boolean().default(true)
    })).max(30).optional(), // Máximo 30 condiciones

    tools: Joi.array().items(Joi.object({
        vc_tool_type: Joi.string().min(1).max(100).required(),
        vc_tool_name: Joi.string().min(1).max(150).required(),
        json_tool_config: toolConfigSchema.required(),
        tx_usage_condition: Joi.string().max(1000).optional().allow('', null),
        b_is_active: Joi.boolean().default(true)
    })).max(15).optional() // Máximo 15 herramientas
}).messages(joiMessagesES);


// SCHEMA PARA ACTUALIZAR FLUJO COMPLETO
export const updateFlowCompleteSchema = Joi.object({
    // Definición principal del flujo (todos opcionales)
    vc_flow_name: Joi.string().min(1).max(100).optional(),
    vc_display_name: Joi.string().min(1).max(150).optional(),
    vc_description: Joi.string().max(1000).optional().allow('', null),
    tx_system_prompt: Joi.string().min(10).max(5000).optional(),
    tx_user_prompt_template: Joi.string().min(10).max(5000).optional(),
    json_flow_config: flowConfigSchema.optional(),
    json_llm_config: llmConfigSchema.optional(),
    b_is_active: Joi.boolean().optional(),

    // Componentes del flujo (opcional, reemplaza completamente si se envía)
    steps: Joi.array().items(Joi.object({
        id: Joi.number().integer().positive().optional(), // Para identificar si es update o create
        vc_step_key: Joi.string().min(1).max(100).required(),
        vc_step_name: Joi.string().min(1).max(150).required(),
        i_step_order: Joi.number().integer().min(1).max(100).required(),
        tx_execution_condition: Joi.string().min(1).max(2000).required(),
        tx_step_output: Joi.string().min(1).max(5000).required(),
        json_expected_data: expectedDataSchema,
        json_step_config: stepConfigSchema,
        b_is_active: Joi.boolean().default(true)
    })).max(20).optional(),

    conditions: Joi.array().items(Joi.object({
        id: Joi.number().integer().positive().optional(),
        vc_condition_key: Joi.string().min(1).max(100).required(),
        vc_condition_name: Joi.string().min(1).max(150).required(),
        tx_condition_expression: Joi.string().min(1).max(2000).required(),
        vc_condition_type: Joi.string().max(50).default('computed'),
        b_is_active: Joi.boolean().default(true)
    })).max(30).optional(),

    tools: Joi.array().items(Joi.object({
        id: Joi.number().integer().positive().optional(),
        vc_tool_type: Joi.string().min(1).max(100).required(),
        vc_tool_name: Joi.string().min(1).max(150).required(),
        json_tool_config: toolConfigSchema.required(),
        tx_usage_condition: Joi.string().max(1000).optional().allow('', null),
        b_is_active: Joi.boolean().default(true)
    })).max(15).optional()
}).messages(joiMessagesES);