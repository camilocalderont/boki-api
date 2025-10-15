import Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';
export const updateTagsSchema = Joi.object({
    VcName: Joi.string().min(2).max(250).required(),
}).messages(joiMessagesES);
