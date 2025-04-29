const Joi = require("joi");

const dbConfigSchema = Joi.object({
  host: Joi.string(),
  port: Joi.alternatives().try(Joi.string(), Joi.number()),
  user: Joi.string(),
  password: Joi.string(),
  dbName: Joi.string(),
  uri: Joi.string().allow(""),
});

const projectConfigSchema = Joi.object({
  modulePath: Joi.string().required(),
  projectName: Joi.string().optional(),
  framework: Joi.string().required(),
  goVersion: Joi.string().optional(),
  database: Joi.string()
    .valid("mongodb", "sqlite", "postgres", "mysql", "none")
    .optional(),
  dbConfig: Joi.when("database", {
    switch: [
      {
        is: "postgres",
        then: Joi.object({
          host: Joi.string().required(),
          port: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
          user: Joi.string().required(),
          password: Joi.string().required(),
          dbName: Joi.string().required(),
          uri: Joi.string().allow(""),
        }),
      },
      {
        is: "mysql",
        then: Joi.object({
          host: Joi.string().required(),
          port: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
          user: Joi.string().required(),
          password: Joi.string().required(),
          dbName: Joi.string().required(),
          uri: Joi.string().allow(""),
        }),
      },
      {
        is: "sqlite",
        then: Joi.object({
          dbName: Joi.string().required(),
        }),
      },
      {
        is: "mongodb",
        then: Joi.object({
          uri: Joi.string().allow(""),
          host: Joi.string(),
          dbName: Joi.string().required(),
          user: Joi.string(),
          password: Joi.string(),
        }),
      },
      {
        is: "none",
        then: Joi.forbidden(),
      },
    ],
    otherwise: dbConfigSchema.optional(),
  }),
  features: Joi.array().items(Joi.string()).optional(),
});

function validateProjectConfig(input) {
  return projectConfigSchema.validate(input, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  });
}

module.exports = { validateProjectConfig };
