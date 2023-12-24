import { getRandomString } from "../utils/util";

export class Todo {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  addedDate: Date;

  constructor(
    title: string = "",
    description: string = "",
    isCompleted: boolean = false
  ) {
    this.id = getRandomString();
    this.title = title;
    this.description = description;
    this.isCompleted = isCompleted;
    this.addedDate = new Date();
  }

  toggleCompleted(): void {
    this.isCompleted = !this.isCompleted;
  }
}
