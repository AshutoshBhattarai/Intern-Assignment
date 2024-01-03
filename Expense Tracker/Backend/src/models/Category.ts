import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import User from "./User";

@Entity("categories")
export default class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  name: string;
  @Column()
  description: string;
  @OneToOne(() => User, { onDelete: "CASCADE" })
  user: User;
  @Column({ default: new Date(), name: "created_at" })
  createdAt: Date;
  @Column({ default: new Date(), name: "updated_at" })
  updatedAt: Date;
}
