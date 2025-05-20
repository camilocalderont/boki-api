import * as Joi from 'joi';
import { joiMessagesES } from '../../../../shared/utils/joi-messages';

export const updateContactSchema = Joi.object({
    clientId: Joi.number().optional(),
    metadata: Joi.object().optional()
  }).messages(joiMessagesES);