
import { integer, pgTable, text , timestamp} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";




export const account = pgTable("account",{
  id: text("id").primaryKey(),
  plaid_id: text("plaid_id"),
  name:  text("name").notNull(),
  userId: text("user_id").notNull()
});

export const accountRelations = relations(account,({many})=>({
  transactions: many(transactions)
}))

export const categories = pgTable("categories",{
  id: text("id").primaryKey(),
  plaid_id: text("plaid_id"),
  name:  text("name").notNull(),
  userId: text("user_id").notNull()
});

export const categoryRelations = relations(categories,({many})=>({
  transactions: many(transactions)
}))

export const transactions = pgTable("transactions",{
  id: text("id").primaryKey(),
  amount: integer("amount").notNull(),
  payee: text("payee").notNull(),
  notes: text("notes"),
  date: timestamp("date",{mode:"date"}).notNull(),
  accountId: text("account_id").references(()=>account.id,{onDelete:"cascade"}).notNull(),
  categoryId: text("category_id").references(()=>categories.id,{onDelete:"set null"}),

});

export const transactionsRelations = relations(transactions,({one})=>({
  account: one(account,{
    fields:[transactions.accountId],
    references:[account.id]
  }),
  category: one(categories,{
    fields:[transactions.categoryId],
    references:[categories.id]
  })
}))



