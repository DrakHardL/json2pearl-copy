import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';

import { Project } from '../model/model-project';
import { Group } from '../model/model-group';
import { User } from '../model/model-user';
import { ApiService } from './api-service';

interface ProjectsResponse {
  data: {
    projects: {
      nodes: {
        id: string;
      }[];
    };
  };
}


@Injectable({
  providedIn: 'root'
})
export class ProjectApiService extends ApiService {

  getProject(project_id: number): Observable<Project> {
    return this.http.get<Project>(`${this.rest_url}/projects/${project_id}`);
  }

  getProjectsIdByTopic(topic: string): Observable<string[]> {
    const query = `{ projects(topics: "${topic}") { nodes { id } } }`;
    return this.http.post<ProjectsResponse>(this.graphql_url, { query }).pipe(
      map(rep =>
        rep.data.projects.nodes.map(node => {
          console.log(node);
          const match = RegExp(/(\d+)$/).exec(node.id);
          return match ? match[1] : null;
        })
          .filter((id): id is string => id !== null)
      )
    );
  }

  searchProjects(
    search: string,
    amount: number = 20,
    page: number = 1,
  ): Observable<Project[]> {
    const buildUrl = (page: number) =>
      `${this.rest_url}/projects?search=${search}&per_page=${amount}&page=${page}`;

    console.log("call searchProject in :", buildUrl(page));

    return this.http.get<Project[]>(buildUrl(page), { observe: 'response' }).pipe(
      switchMap(response => {
        console.log(response);

        const totalPages = Number(response.headers.get('x-total-pages')) || 1;

        const allProjects: Project[] = response.body || [];

        if (totalPages <= 1) {
          return of(allProjects);
        }

        const requests: Observable<Project[]>[] = [];
        for (let page = 2; page <= totalPages; page++) {
          requests.push(this.http.get<Project[]>(buildUrl(page)));
        }

        return forkJoin(requests).pipe(
          map(responses => allProjects.concat(...responses))
        );
      })
    );
  }

  getProjectForks(project_id: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.rest_url}/projects/${project_id}/forks`);
  }

  getProjectUsers(project_id: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.rest_url}/projects/${project_id}/users`);
  }

  getProjectGroups(project_id: number): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.rest_url}/projects/${project_id}/groups`);
  }

}
