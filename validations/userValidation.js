const Joi = require("joi");

const validateInvite = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid("ADMIN", "TEACHER", "PARENT").required(),
    phone: Joi.string(),
  });
  return schema.validate(user);
};

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

const validateAcceptInvitation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    invitationCode: Joi.string().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string(),
  });
  return schema.validate(data);
};

module.exports = {
  validateInvite,
  validateLogin,
  validateAcceptInvitation,
};
