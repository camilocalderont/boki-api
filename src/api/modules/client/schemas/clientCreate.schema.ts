import * as Joi from 'joi';

export const createClientSchema = Joi.object({
  VcIdentificationNumber: Joi.string().min(5).max(50).required()
    .messages({
      'string.base': 'Identification number must be text',
      'string.empty': 'Identification number cannot be empty',
      'string.min': 'Identification number must have at least {#limit} characters',
      'string.max': 'Identification number must have at most {#limit} characters',
      'any.required': 'Identification number is required'
    }),

  VcPhone: Joi.string().pattern(/^[0-9]{1,10}$/).allow('', null)
    .messages({
      'string.pattern.base': 'Phone number must contain only numbers and maximum 10 digits',
    }),

  vcNickName: Joi.string().min(2).max(50),

  VcFirstName: Joi.string().min(2).max(50).required(),

  VcSecondName: Joi.string().min(2).max(50).allow('', null),

  VcFirstLastName: Joi.string().min(2).max(50).required(),

  VcSecondLastName: Joi.string().min(2).max(50).allow('', null),

  VcEmail: Joi.string().email().required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),

  VcPassword: Joi.string().min(8).required()
    .messages({
      'string.min': 'Password must be at least {#limit} characters long',
      'any.required': 'Password is required'
    })
});

// Forzar recompilación