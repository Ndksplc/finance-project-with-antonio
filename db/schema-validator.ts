import { account, categories, transactions } from "./schema";
import {createInsertSchema} from "drizzle-zod";
import {z} from "zod";

export const inserAcccountSchema = createInsertSchema(account);
export const inserCategorySchema = createInsertSchema(categories);
export const insertTransactionSchema = createInsertSchema(transactions,{date: z.coerce.date()});