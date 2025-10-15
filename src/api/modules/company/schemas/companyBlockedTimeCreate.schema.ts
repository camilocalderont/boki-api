import Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';

export const createCompanyBlockedTimeSchema = Joi.object({
  CompanyId: Joi.number().required(),
  DtInitDate: Joi.date().required(),
  DtEndDate: Joi.date().required(),
  VcMessage: Joi.string().allow('', null),
}).messages(joiMessagesES);