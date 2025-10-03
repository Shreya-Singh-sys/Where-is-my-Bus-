import Joi from 'joi';

export const routeValidation = {
  create: Joi.object({
    route_number: Joi.string().required(),
    route_name: Joi.string().required(),
    start_point: Joi.string().required(),
    end_point: Joi.string().required(),
    distance_km: Joi.number().positive().required(),
    estimated_duration_mins: Joi.number().integer().positive().required(),
    is_active: Joi.boolean().default(true)
  }),

  update: Joi.object({
    route_number: Joi.string(),
    route_name: Joi.string(),
    start_point: Joi.string(),
    end_point: Joi.string(),
    distance_km: Joi.number().positive(),
    estimated_duration_mins: Joi.number().integer().positive(),
    is_active: Joi.boolean()
  }).min(1)
};

export default routeValidation;
