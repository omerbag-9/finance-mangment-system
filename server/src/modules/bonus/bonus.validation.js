import Joi from 'joi';

export const createBonusSchema = Joi.object({
  title: Joi.string().required().trim(),
  amount: Joi.number().required().min(0),
  recipient: Joi.string().required(),
  reason: Joi.string().required().trim(),
  attachments: Joi.array().items(
    Joi.object({
      fileName: Joi.string().required(),
      fileUrl: Joi.string().required()
    })
  )
});

export const validateCreateBonus = (req, res, next) => {
  const { error } = createBonusSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.details[0].message
    });
  }
  next();
};
