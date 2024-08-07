export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  creator: string;
  doneBy?: string | null;
  dateCreated: string;
  dateCompleted?: string | null;
}
