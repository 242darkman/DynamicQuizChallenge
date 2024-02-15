import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class QuestionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column()
  answer: string;
  @Column({ nullable: true })
  hint: string;

  @Column({ nullable: true })
  explanation: string;
}
