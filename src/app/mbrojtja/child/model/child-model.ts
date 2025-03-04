import { Parent } from '../../parent/model/parent-model';

export interface Child {
  id: number;
  name: string;
  issueNumber: string;
  parent: Parent;
}
