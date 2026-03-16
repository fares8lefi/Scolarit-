const Joi = require("joi");

exports.validateInvite = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid("ADMIN", "TEACHER", "PARENT").required(),
    phone: Joi.string(),
    classId: Joi.string(),
    children: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        classId: Joi.string().required()
      })
    )
  });
  return schema.validate(user);
};

exports.validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

exports.validateAcceptInvitation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    invitationCode: Joi.string().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string(),
  });
  return schema.validate(data);
};
