import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiBaseService } from './api-base.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService extends ApiBaseService {
  getApplicantProfile(userId: string): Observable<any> {
    return this.get<any>(`users/${userId}`);
  }

  getEducation(): Observable<any> {
    return this.get<any>(`education`).pipe(
      map((response) => response.content || [])
    );
  }

  getEducationByUser(userId: string): Observable<any> {
    return this.get<any>(`education/user/${userId}`).pipe(
      map((response) => response || [])
    );
  }
  addEducation(educationData: any): Observable<any> {
    return this.post<any>(`education`, educationData);
  }

  deleteEducation(educationId: string): Observable<any> {
    return this.delete<any>(`education/${educationId}`);
  }
  addExperience(experienceData: any): Observable<any> {
    return this.post<any>(`experience`, experienceData);
  }

  getExperienceByUser(userId: string): Observable<any> {
    return this.get<any>(`experience/user/${userId}`).pipe(
      map((response) => response || [])
    );
  }

  deleteExperience(experienceId: string): Observable<any> {
    return this.delete<any>(`experience/${experienceId}`);
  }

  getSkillsByUser(userId: string): Observable<any> {
    return this.get<any>(`skills/user/${userId}`).pipe(
      map((response) => response || [])
    );
  }

  addSkill(skillData: any): Observable<any> {
    return this.post<any>(`skills`, skillData);
  }

  deleteSkill(skillId: string): Observable<any> {
    return this.delete<any>(`skills/${skillId}`);
  }
}
