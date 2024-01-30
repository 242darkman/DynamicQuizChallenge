import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubjectEntity } from 'src/quiz/model/subject/subject.entity';
import { SubjectInterface } from 'src/quiz/model/subject/subject.interface';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(SubjectEntity)
    private readonly subjectRepository: Repository<SubjectEntity>,
  ) {}

  async createSubject(subjectData: SubjectInterface): Promise<SubjectEntity> {
    const existingSubject = await this.subjectRepository.findOne({
      where: { name: subjectData.name },
    });

    if (existingSubject) {
      throw new Error('Subject already exists');
    }

    const newSubject = this.subjectRepository.create(subjectData);
    return this.subjectRepository.save(newSubject);
  }

  async getAllSubjects(): Promise<SubjectEntity[]> {
    return this.subjectRepository.find();
  }

  async getSubjectById(id: number): Promise<SubjectEntity> {
    return this.subjectRepository.findOne({ where: { id } });
  }
}
