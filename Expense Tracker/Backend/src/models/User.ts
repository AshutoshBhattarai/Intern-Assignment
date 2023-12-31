import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string | undefined;
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
  constructor(name: string, email: string, password: string) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
