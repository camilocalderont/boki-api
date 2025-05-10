import Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';
import { updateAppointmentStageSchema } from './appointmentStageUpdate.schema';
import { updateAppointmentStateSchema } from './appointmentStateUpdate.schema';

export const updateAppointmentSchema = Joi.object({
    ClientId: Joi.number().integer().positive().optional(),
    ServiceId: Joi.number().integer().positive().optional(),
    ProfessionalId: Joi.number().integer().positive().optional(),
    DtDate: Joi.date().optional(),
    TStartTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    CurrentStateId: Joi.number().integer().positive().optional(),
    BIsCompleted: Joi.boolean().optional(),
    BIsAbsent: Joi.boolean().optional()
}).messages(joiMessagesES);
