import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
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
  @CreateDateColumn({ default: new Date(), name: "created_at", update: false })
  createdAt: Date;
  @UpdateDateColumn({ default: new Date(), name: "updated_at" })
  updatedAt: Date;
}
