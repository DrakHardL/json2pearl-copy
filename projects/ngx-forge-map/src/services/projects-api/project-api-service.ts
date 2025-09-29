import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Project } from '../../model/model-project';
import { Group } from '../../model/model-group';
import { User } from '../../model/model-user';
import { ApiService } from '../api-service';


@Injectable({
  providedIn: 'root'
})
export class ProjectApiService extends ApiService {

  getAllProject(
    amount: number = 20,
    page: number = 1,
    skip_project: number[] = []
  ): Observable<Project[]> {
    const skipProjectsParam = skip_project.length > 0 ? `&skip_projects=${skip_project.join(',')}` : '';
    return this.http.get<Project[]>(
      `${this.base_url}/projects?per_page=${amount}&page=${page}${skipProjectsParam}`
    );
  }

  getProject(project_id: number): Observable<Project> {
    return this.http.get<Project>(`${this.base_url}/projects/${project_id}`);
  }

  searchProjects(
    search: string,
    amount: number = 20,
    page: number = 1,
  ): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.base_url}/projects?search=${search}&per_page=${amount}&page=${page}`);
  }

  getProjectForks(project_id: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.base_url}/projects/${project_id}/forks`);
  }

  getProjectUsers(project_id: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.base_url}/projects/${project_id}/users`);
  }

  getProjectGroups(project_id: number): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.base_url}/projects/${project_id}/groups`);
  }

}
