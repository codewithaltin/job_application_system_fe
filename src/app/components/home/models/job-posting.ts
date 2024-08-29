import { Application } from '../../applicants-list/models/application';

export interface JobPosting {
  id: number;
  title: string;
  description: string;
  salary: number;
  employer: {
    name: string;
  } | null;
  applications: Application[];
  postDate: string;
  endDate: string;
  location: string | null;
  category: string | null;
  openPositions: number;
}
