import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const createCompanyAgentSchema = Joi.object({
    CompanyId: Joi.number().integer().positive().required(),
    VcAgentName: Joi.string().min(1).max(100).required(),
    TxPromptTemplate: Joi.string().min(1).max(65000).required(),
    BIsActive: Joi.boolean().default(true),

    // Configuración del modelo
    VcModelName: Joi.string().max(100).optional(),
    VcRepoId: Joi.string().max(200).optional(),
    VcFilename: Joi.string().max(200).optional(),
    VcLocalName: Joi.string().max(100).optional(),

    // Parámetros del LLM
    DcTemperature: Joi.number().min(0).max(2).default(0.1),
    IMaxTokens: Joi.number().integer().min(1).max(10000).default(100),
    DcTopP: Joi.number().min(0).max(1).default(0.8),
    ITopK: Joi.number().integer().min(1).max(100).default(5),
    IContextLength: Joi.number().integer().min(1).max(32768).default(1024),
    TxStopTokens: Joi.string().optional(),

    // Hardware
    IMaxMemoryMb: Joi.number().integer().min(100).max(50000).default(6000),
    INThreads: Joi.number().integer().min(1).max(32).default(2),
    BlsUseGpu: Joi.boolean().default(false)
}).messages(joiMessagesES); 