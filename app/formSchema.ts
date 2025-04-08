import { z } from "zod";

export const schema = z.object({
  word1: z.string().trim().min(2).max(4),
  word10: z.string().trim().min(2).max(4),
  word11: z.string().trim().min(2).max(4),
  word12: z.string().trim().min(2).max(4),
  word13: z.string().trim().min(2).max(4),
  word14: z.string().trim().min(2).max(4),
  word15: z.string().trim().min(2).max(4),
  word16: z.string().trim().min(2).max(4),
  word17: z.string().trim().min(2).max(4),
  word18: z.string().trim().min(2).max(4),
  word19: z.string().trim().min(2).max(4),
  word2: z.string().trim().min(2).max(4),
  word20: z.string().trim().min(2).max(4),
  word3: z.string().trim().min(2).max(4),
  word4: z.string().trim().min(2).max(4),
  word5: z.string().trim().min(2).max(4),
  word6: z.string().trim().min(2).max(4),
  word7: z.string().trim().min(2).max(4),
  word8: z.string().trim().min(2).max(4),
  word9: z.string().trim().min(2).max(4),
});
