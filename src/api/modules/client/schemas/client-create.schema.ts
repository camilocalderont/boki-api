import * as Joi from 'joi';

export const createClientSchema = Joi.object({
  VcIdentificationNumber: Joi.string().min(5).max(50).required()
    .messages({
      'string.base': 'El número de identificación debe ser texto',
      'string.empty': 'El número de identificación no puede estar vacío',
      'string.min': 'El número de identificación debe tener al menos {#limit} caracteres',
      'string.max': 'El número de identificación debe tener como máximo {#limit} caracteres',
      'any.required': 'El número de identificación es requerido'
    }),

  VcPhone: Joi.string().pattern(/^\+[0-9]{1,3}[0-9]{6,14}$/).required()
    .messages({
      'string.pattern.base': 'El número de teléfono debe tener formato válido (+país seguido de 6-14 dígitos)',
      'any.required': 'El número de teléfono es requerido'
    }),

  vcNickName: Joi.string().min(2).max(50),

  VcFirstName: Joi.string().min(2).max(50).required(),

  VcSecondName: Joi.string().min(2).max(50).allow('', null),

  VcFirstLastName: Joi.string().min(2).max(50).required(),

  VcSecondLastName: Joi.string().min(2).max(50).allow('', null),

  VcEmail: Joi.string().email().required()
    .messages({
      'string.email': 'Debe proporcionar un correo electrónico válido',
      'any.required': 'El correo electrónico es requerido'
    }),

  VcPassword: Joi.string().min(8).required()
    .messages({
      'string.min': 'La contraseña debe tener al menos {#limit} caracteres',
      'any.required': 'La contraseña es requerida'
    })
});