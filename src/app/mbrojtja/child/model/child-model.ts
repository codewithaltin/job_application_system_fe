import { Parent } from '../../parent/model/parent-model';

export interface Child {
  id: number;
  name: string;
  age: number;
  number: number;
  deleted: boolean;
  parent: Parent;
}
