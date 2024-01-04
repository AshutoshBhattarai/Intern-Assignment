import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import User from "./User";

@Entity("income")
export default class Income {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  source: string;
  @Column("float")
  amount: number;
  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @RelationId((income: Income) => income.user)
  user: User;
  @Column({ default: new Date(), name: "created_at", update: false })
  createdAt: Date;
  @Column({ default: new Date(), name: "updated_at" })
  updatedAt: Date;
}
