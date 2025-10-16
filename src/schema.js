const { z } = require("zod");
const createSchema = z.object({
  title: z.string(),
  pubKey: z.string(),
  content: z.string(),
  created_at: z.date().optional().default(new Date()),
});
const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.number().optional(),
  SESSION_SECRET: z
    .string()
    .optional()
    .default(Math.random().toFixed(20).toString()),
});

module.exports = {
  createSchema,
  envSchema,
};
