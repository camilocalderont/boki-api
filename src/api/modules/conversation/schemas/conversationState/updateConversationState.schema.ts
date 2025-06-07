import Joi from "joi";
import { joiMessagesES } from "~/api/shared/utils/joi-messages";

export const updateConversationStateSchema = Joi.object({
    flow: Joi.string().optional(),
    step: Joi.string().optional(),
    data: Joi.object().optional()
  }).unknown(false).messages({
    ...joiMessagesES,
    'object.unknown': 'El campo "{#label}" no está permitido'
  });