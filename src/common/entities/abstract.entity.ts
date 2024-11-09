import { instanceToPlain } from 'class-transformer';
import { PrimaryGeneratedColumn } from 'typeorm';

export abstract class AbstractEntity<T> {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }

  toPlain(): T {
    return instanceToPlain(this) as T;
  }
}
