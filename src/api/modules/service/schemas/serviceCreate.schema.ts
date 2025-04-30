import * as Joi from 'joi';
import { joiMessagesES } from '../../../shared/utils/joi-messages';
import { createServiceStageSchema } from './serviceStageCreate.schema';

export const createServiceSchema = Joi.object({
  VcName: Joi.string().required().min(3).max(100),
  VcDescription: Joi.string().max(500).optional(),
  IMinimalPrice: Joi.number().integer().min(0).required(),
  IMaximalPrice: Joi.number().integer().min(Joi.ref('IMinimalPrice')).required()
    .messages({
      'number.min': 'El precio máximo debe ser mayor o igual al precio mínimo'
    }),
  IRegularPrice: Joi.number().integer().min(Joi.ref('IMinimalPrice')).max(Joi.ref('IMaximalPrice')).required()
    .messages({
      'number.min': 'El precio regular debe ser mayor o igual al precio mínimo',
      'number.max': 'El precio regular debe ser menor o igual al precio máximo',
      'number.integer': 'El precio regular debe ser un número entero'
    }),
  DTaxes: Joi.number().precision(2).min(0).max(100).default(0),
  VcTime: Joi.string().pattern(/^([0-9]{1,2}):([0-5][0-9])$/).required(),
  CompanyId: Joi.number().integer().positive().required(),
  CategoryId: Joi.number().integer().positive().required(),
  TxPicture: Joi.string().optional(),
  ServiceStages: Joi.alternatives().try(
    Joi.array().items(createServiceStageSchema),
    Joi.string()
  ).optional()
}).messages(joiMessagesES);
