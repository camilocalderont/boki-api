import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const createCompanyAgentSchema = Joi.object({
    CompanyId: Joi.number().integer().positive().required(),
    VcAgentName: Joi.string().min(1).max(100).required(),
    TxPromptTemplate: Joi.string().min(1).max(65000).required(),
    BIsActive: Joi.boolean().default(true)
}).messages(joiMessagesES); 