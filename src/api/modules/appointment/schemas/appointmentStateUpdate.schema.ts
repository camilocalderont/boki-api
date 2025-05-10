import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const updateAppointmentStateSchema = Joi.object({
    StateId: Joi.number().optional(),
    VcChangedBy: Joi.string().optional(),
    VcReason: Joi.string().optional(),
    DtPreviousDate: Joi.date().optional(),
    TPreviousTime: Joi.string().optional(),
    DtCurrentDate: Joi.date().optional(),
    TCurrentTime: Joi.string().optional(),
}).messages(joiMessagesES);
