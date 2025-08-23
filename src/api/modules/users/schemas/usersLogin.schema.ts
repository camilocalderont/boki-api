import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const loginUsersSchema = Joi.object({
  VcEmail: Joi.string().email().required(),
  VcPassword: Joi.string().min(1).required()
}).messages(joiMessagesES);