import { pgTable, uuid, text, boolean, date } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const todo = pgTable("todo", {
	id: uuid("id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	text: text("text").notNull(),
	completed: boolean("completed").default(false).notNull(),
	creator: text("creator").notNull(),
	doneBy: text("doneBy"),
	dateCreated: date("dateCreated").notNull(),
	dateCompleted: date("dateCompleted"),
});