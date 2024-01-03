import { randomUUID } from "crypto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity("users")
export default class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  username: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @Column({ default: new Date(), name: "created_at" })
  createdAt: Date;
  @Column({ default: new Date(), name: "updated_at" })
  updatedAt: Date;
  @Column({ nullable: true, name: "refresh_token" })
  refreshToken?: string;
  @Column({ name: "reset_code", default: randomUUID() })
  resetCode: string;
}
