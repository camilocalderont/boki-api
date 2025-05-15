import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const createTagsSchema = Joi.object({
  VcName: Joi.string().min(2).max(250).required(),
}).messages(joiMessagesES);
