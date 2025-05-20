import Joi from "joi";
import { joiMessagesES } from "~/api/shared/utils/joi-messages";

export const createConversationStateSchema = Joi.object({
    contactId: Joi.string().required(),
    flow: Joi.string().required(),
    state: Joi.object().required(),
    expiresAt: Joi.date().optional()
  }).messages(joiMessagesES);