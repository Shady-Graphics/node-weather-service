import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Metric {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  sensorId!: string;

  @Column({ type: "decimal" })
  temperature!: number;

  @Column({ type: "decimal" })
  humidity!: number;

  @Column({ type: "decimal" })
  windSpeed!: number;
}
