import Joi from 'joi';

export const trackingValidation = {
  location: Joi.object({
    bus_id: Joi.string().uuid().required(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    speed_kmph: Joi.number().min(0).default(0),
    heading: Joi.number().min(0).max(360),
    gps_timestamp: Joi.date().iso().default(() => new Date())
  }),

  tracking: Joi.object({
    bus_id: Joi.string().uuid().required(),
    route_id: Joi.string().uuid().required(),
    current_stop_id: Joi.string().uuid().allow(null),
    next_stop_id: Joi.string().uuid().allow(null),
    current_latitude: Joi.number().min(-90).max(90).required(),
    current_longitude: Joi.number().min(-180).max(180).required(),
    speed_kmph: Joi.number().min(0).default(0),
    status: Joi.string().valid('on_time', 'delayed', 'breakdown', 'off_route').default('on_time'),
    delay_mins: Joi.number().integer().min(0).default(0)
  })
};

export default trackingValidation;
