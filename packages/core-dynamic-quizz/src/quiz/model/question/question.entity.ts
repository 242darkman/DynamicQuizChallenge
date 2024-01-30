import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class QuestionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  answer: string;
  @Column({ nullable: true })
  hint: string;

  @Column({ nullable: true })
  explanation: string;
}
