import Joi from 'joi';

export const stopValidation = {
  create: Joi.object({
    stop_name: Joi.string().required(),
    stop_code: Joi.string().required(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    address: Joi.string().allow('', null)
  }),

  update: Joi.object({
    stop_name: Joi.string(),
    stop_code: Joi.string(),
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180),
    address: Joi.string().allow('', null)
  }).min(1)
};

export default stopValidation;
