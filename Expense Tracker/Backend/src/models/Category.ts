import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import User from "./User";

@Entity("categories")
export default class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  title: string;
  @Column()
  description: string;
  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: string;
  @Column({ default: new Date(), name: "created_at" })
  createdAt: Date;
  @Column({ default: new Date(), name: "updated_at" })
  updatedAt: Date;
}
