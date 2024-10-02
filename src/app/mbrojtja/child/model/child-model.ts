import { Parent } from '../../parent/model/parent-model';

export interface Child {
  id: number;
  name: string;
  description: string;
  parent: Parent;
  isDeleted: boolean;
}
