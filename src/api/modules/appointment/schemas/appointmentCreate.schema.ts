import Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';
import { createAppointmentStageSchema } from './appointmentStageCreate.schema';
import { createAppointmentStateSchema } from './appointmentStateCreate.schema';

export const createAppointmentSchema = Joi.object({
    ClientId: Joi.number().integer().positive().required(),
    ServiceId: Joi.number().integer().positive().required(),
    ProfessionalId: Joi.number().integer().positive().required(),
    DtDate: Joi.date().required(),
    TTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    CurrentStateId: Joi.number().integer().positive().required(),
    BIsCompleted: Joi.boolean().required(),
    BIsAbsent: Joi.boolean().required(),
    AppointmentStages: Joi.array().items(createAppointmentStageSchema).optional(),
    AppointmentStates: Joi.array().items(createAppointmentStateSchema).optional()
}).messages(joiMessagesES);
