import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const createAppointmentStageSchema = Joi.object({
    ServiceStageId: Joi.number().required(),
    StartDateTime: Joi.date().required(),
    EndDateTime: Joi.date().required(),
    BlsProfessionalBusy: Joi.boolean().required(),
}).messages(joiMessagesES);

