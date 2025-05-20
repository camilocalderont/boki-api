import * as Joi from 'joi';
import { joiMessagesES } from '../../../../shared/utils/joi-messages';

export const createSystemEventSchema = Joi.object({
  contactId: Joi.string().required(),
  type: Joi.string().required(),
  data: Joi.object().required()
}).messages(joiMessagesES);