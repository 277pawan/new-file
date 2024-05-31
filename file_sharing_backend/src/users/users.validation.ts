import * as Joi from 'joi';

export const validationSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    useremail: Joi.string().email().required(),
    userpassword: Joi.string().min(6).max(30).required(),
    image:Joi.string(),
});
