import Joi from "joi";
import { joiMessagesES } from "~/api/shared/utils/joi-messages";

export const createConversationStateSchema = Joi.object({
    contactId: Joi.string().required(),
    flow: Joi.string().required(),
    step: Joi.string().required(),
    data: Joi.object().optional()
  }).unknown(false).messages({
    ...joiMessagesES,
    'object.unknown': 'El campo "{#label}" no está permitido'
  });