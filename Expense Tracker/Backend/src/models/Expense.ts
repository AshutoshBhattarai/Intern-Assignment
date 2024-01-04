import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import User from "./User";
import Category from "./Category";

@Entity("expenses")
export default class Expense {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column("float")
  amount: number;
  @Column()
  date: Date;
  @Column()
  description: string;
  @Column()
  image: string;
  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @RelationId((expense: Expense) => expense.user)
  user: User;
  @ManyToOne(() => Category, { onDelete: "SET NULL" })
  @RelationId((expense: Expense) => expense.category)
  category: Category;
  @Column({ default: new Date(), name: "created_at", update: false })
  createdAt: Date;
  @Column({ default: new Date(), name: "updated_at" })
  updatedAt: Date;
}
