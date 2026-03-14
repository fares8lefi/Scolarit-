import Joi from "joi";

export const validateInvite = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid("ADMIN", "TEACHER", "PARENT").required(),
    phone: Joi.string(),
  });
  return schema.validate(user);
};

export const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

export const validateAcceptInvitation = (data) => {
  const schema = Joi.object({
    password: Joi.string().required(),
    phone: Joi.string(),
  });
  return schema.validate(data);
};
