import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const updateProfessionalServiceSchema = Joi.object({
  ServiceId: Joi.number().integer().required()
}).messages(joiMessagesES);