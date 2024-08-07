"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/drizzle";
import { todo } from "@/db/schema";
import { Todo } from "@/types/todo";

export const getData = async (): Promise<Todo[]> => {
  const data = await db.select().from(todo);
  return data;
};

export const addTodo = async (id: string, text: string, creator: string, dateCreated: string) => {
  await db.insert(todo).values({
    id,
    text,
    completed: false,
    creator,
    dateCreated,
  });
  revalidatePath("/");
};

export const deleteTodo = async (id: string) => {
  await db.delete(todo).where(eq(todo.id, id));
  revalidatePath("/");
};

export const toggleTodo = async (id: string, doneBy: string | null, dateCompleted: string | null) => {
  const [todoItem] = await db.select().from(todo).where(eq(todo.id, id));

  if (todoItem) {
    await db.update(todo).set({
      completed: !todoItem.completed,
      doneBy: todoItem.completed ? null : doneBy,
      dateCompleted: todoItem.completed ? null : dateCompleted,
    }).where(eq(todo.id, id));
    revalidatePath("/");
  }
};

export const editTodo = async (id: string, text: string) => {
  await db.update(todo).set({ text }).where(eq(todo.id, id));
  revalidatePath("/");
};
