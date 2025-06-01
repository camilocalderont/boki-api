import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const createCompanyWhatsappSettingSchema = Joi.object({
    CompanyId: Joi.number().integer().positive().required(),
    VcPhoneNumberId: Joi.string().min(1).max(100).required(),
    VcPhoneNumber: Joi.string().min(1).max(100).required(),
    VcDisplayName: Joi.string().min(1).max(100).required(),
    VcAccessToken: Joi.string().min(1).max(100).required(),
    VcBotName: Joi.string().min(1).max(100).required(),
    BIsActive: Joi.boolean().required(),
}).messages(joiMessagesES); 
