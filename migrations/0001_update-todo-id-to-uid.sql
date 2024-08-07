CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

ALTER TABLE "todo" 
    ALTER COLUMN "id" SET DATA TYPE uuid 
    USING uuid_generate_v4();

ALTER TABLE "todo" 
    ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();

ALTER TABLE "todo" 
    ALTER COLUMN "dateCreated" SET DATA TYPE date 
    USING "dateCreated"::date;

ALTER TABLE "todo" 
    ALTER COLUMN "dateCompleted" SET DATA TYPE date 
    USING "dateCompleted"::date;
