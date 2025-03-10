// validation/userValidation.js

import Joi from 'joi';

const validateUser = (data) => {
  const schema = Joi.object({
    username: Joi.string()
      .alphanum() // Allows only alphanumeric characters
      .min(3)
      .max(30)
      .required()
      .messages({
        "string.base": "Username should be a type of 'text'.",
        "string.alphanum": "Username can only contain letters and numbers.",
        "string.empty": "Username cannot be empty.",
        "string.min": "Username should have at least 3 characters.",
        "string.max": "Username should have at most 30 characters.",
        "any.required": "Username is a required field."
      }),
      
    email: Joi.string().email().required().messages({
      "string.email": "Please enter a valid email address.",
      "any.required": "Email is a required field."
    }),
    
    password: Joi.string().min(6).required().messages({
      "string.min": "Password should have at least 6 characters.",
      "any.required": "Password is a required field."
    }),
    
    role: Joi.string().valid('user', 'retailer', 'admin').required()
  });

  return schema.validate(data);
};

export default validateUser;
