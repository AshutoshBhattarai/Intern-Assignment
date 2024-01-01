import { randomUUID } from "crypto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @Column()
  createdAt: Date;
  @Column()
  updatedAt: Date;
  @Column({ name: "refresh_token", nullable: true })
  refreshToken?: string;
  @Column({ name: "reset_code" })
  resetCode: string;
  constructor(name: string, email: string, password: string) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.resetCode = randomUUID();
  }
}
