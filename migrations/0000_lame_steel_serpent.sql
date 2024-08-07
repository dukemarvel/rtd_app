CREATE TABLE IF NOT EXISTS "todo" (
	"id" integer PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"creator" text NOT NULL,
	"doneBy" text,
	"dateCreated" text NOT NULL,
	"dateCompleted" text
);
