import * as Joi from 'joi';
import { joiMessagesES } from '../../../../shared/utils/joi-messages';

export const createContactSchema = Joi.object({
    phone: Joi.string().required(),
    clientId: Joi.number().optional(),
    metadata: Joi.object().optional()
  }).messages(joiMessagesES);