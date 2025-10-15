import Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const updateAppointmentStageSchema = Joi.object({
    ServiceStageId: Joi.number().required(),
    StartDateTime: Joi.date().required(),
    EndDateTime: Joi.date().required(),
    BlsProfessionalBusy: Joi.boolean().required(),
}).messages(joiMessagesES);

