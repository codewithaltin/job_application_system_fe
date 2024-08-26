import { Application } from './application';

export interface Applicant {
  id: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  applications: Application[];
}
