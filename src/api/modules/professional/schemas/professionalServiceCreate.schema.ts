import Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const createProfessionalServiceSchema = Joi.object({
  ServiceId: Joi.number().integer().required()
}).messages(joiMessagesES);