export class Todo {
  id: number;
  userid: number;
  title: string;
  completed: boolean;
  constructor(id: number, title: string, completed: boolean, userid: number) {
    this.id = id;
    this.title = title;
    this.completed = completed;
    this.userid = userid;
  }
}
