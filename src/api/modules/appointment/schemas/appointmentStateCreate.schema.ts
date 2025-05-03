import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const createAppointmentStateSchema = Joi.object({
    StateId: Joi.number().required(),
    VcChangedBy: Joi.string().required(),
    VcReason: Joi.string().required(),
    DtDateTime: Joi.date().optional(),
    DtPreviousDate: Joi.date().required(),
    TPreviousTime: Joi.string().required(),
    DtCurrentDate: Joi.date().required(),
    TCurrentTime: Joi.string().required(),
}).messages(joiMessagesES);
