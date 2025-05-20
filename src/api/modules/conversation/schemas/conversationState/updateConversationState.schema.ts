import Joi from "joi";
import { joiMessagesES } from "~/api/shared/utils/joi-messages";

export const updateConversationStateSchema = Joi.object({
    flow: Joi.string().optional(),
    state: Joi.object().optional(),
    expiresAt: Joi.date().optional()
  }).messages(joiMessagesES);