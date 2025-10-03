import Joi from 'joi';

export const busValidation = {
  create: Joi.object({
    bus_number: Joi.string().required(),
    bus_type: Joi.string().valid('AC', 'Non-AC', 'Deluxe').required(),
    capacity: Joi.number().integer().min(1).required(),
    gps_device_id: Joi.string().required(),
    status: Joi.string().valid('active', 'inactive', 'maintenance').default('active')
  }),

  update: Joi.object({
    bus_number: Joi.string(),
    bus_type: Joi.string().valid('AC', 'Non-AC', 'Deluxe'),
    capacity: Joi.number().integer().min(1),
    gps_device_id: Joi.string(),
    status: Joi.string().valid('active', 'inactive', 'maintenance')
  }).min(1)
};

export default busValidation;
