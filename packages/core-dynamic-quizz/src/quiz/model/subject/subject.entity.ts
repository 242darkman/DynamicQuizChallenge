import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SubjectEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;
}
