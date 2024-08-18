import { uuid, text, boolean, pgTable, date } from 'drizzle-orm/pg-core';

export const todo = pgTable("todo", {
  id: uuid("id").default('uuid_generate_v4()').primaryKey(),
  text: text("text").notNull(),
  completed: boolean("completed").default(false).notNull(),
  creator: text("creator").notNull(),
  doneBy: text("doneBy"),
  dateCreated: date("dateCreated", { mode: "date" }).notNull(),
  dateCompleted: date("dateCompleted", { mode: "date" }),
});
