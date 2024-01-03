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
  @Column({default : new Date()})
  createdAt: Date;
  @Column({default : new Date()})
  updatedAt: Date;
  @Column({ nullable: true, name: "refresh_token" })
  refreshToken?: string;
  @Column({ name: "reset_code",default:randomUUID() })
  resetCode: string;
}
