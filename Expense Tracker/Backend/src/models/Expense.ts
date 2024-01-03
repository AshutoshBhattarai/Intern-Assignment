import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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
  user: User;
  @ManyToOne(() => Category, { onDelete: "SET NULL" })
  category: Category;
  @Column({ default: new Date(), name: "created_at" })
  createdAt: Date;
  @Column({ default: new Date(), name: "updated_at" })
  updatedAt: Date;
}
