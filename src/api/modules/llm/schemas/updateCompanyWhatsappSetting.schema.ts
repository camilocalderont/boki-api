import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const updateCompanyWhatsappSettingSchema = Joi.object({
    CompanyId: Joi.number().integer().positive().optional(),
    VcPhoneNumberId: Joi.string().min(1).max(100).optional(),
    VcPhoneNumber: Joi.string().min(1).max(100).optional(),
    VcDisplayName: Joi.string().min(1).max(100).optional(),
    VcAccessToken: Joi.string().min(1).max(100).optional(),
    VcBotName: Joi.string().min(1).max(100).optional(),
    BIsActive: Joi.boolean().optional(),
}).messages(joiMessagesES); 
