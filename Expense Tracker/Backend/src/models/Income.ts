import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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
  @Column({ default: true })
  active: boolean;
  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @RelationId((income: Income) => income.user)
  @JoinColumn({ name: "user_id" })
  user: User;
  @CreateDateColumn({ default: new Date(), name: "created_at", update: false })
  createdAt: Date;
  @UpdateDateColumn({ default: new Date(), name: "updated_at" })
  updatedAt: Date;
}
