import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const updateCompanyAgentSchema = Joi.object({
    CompanyId: Joi.number().integer().positive().optional(),
    VcAgentName: Joi.string().min(1).max(100).optional(),
    TxPromptTemplate: Joi.string().min(1).max(65000).optional(),
    BIsActive: Joi.boolean().optional()
}).messages(joiMessagesES); 