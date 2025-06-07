import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const updateCompanyAgentSchema = Joi.object({
    CompanyId: Joi.number().integer().positive().optional(),
    VcAgentName: Joi.string().min(1).max(100).optional(),
    TxPromptTemplate: Joi.string().min(1).max(65000).optional(),
    BIsActive: Joi.boolean().optional(),

    // Configuración del modelo
    VcModelName: Joi.string().max(100).optional(),
    VcRepoId: Joi.string().max(200).optional(),
    VcFilename: Joi.string().max(200).optional(),
    VcLocalName: Joi.string().max(100).optional(),

    // Parámetros del LLM
    DcTemperature: Joi.number().min(0).max(2).optional(),
    IMaxTokens: Joi.number().integer().min(1).max(10000).optional(),
    DcTopP: Joi.number().min(0).max(1).optional(),
    ITopK: Joi.number().integer().min(1).max(100).optional(),
    IContextLength: Joi.number().integer().min(1).max(32768).optional(),
    TxStopTokens: Joi.string().optional(),

    // Hardware
    IMaxMemoryMb: Joi.number().integer().min(100).max(50000).optional(),
    INThreads: Joi.number().integer().min(1).max(32).optional(),
    BlsUseGpu: Joi.boolean().optional()
}).messages(joiMessagesES); 