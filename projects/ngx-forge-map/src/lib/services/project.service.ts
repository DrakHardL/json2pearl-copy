import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';

import { Project } from '../model/project.model';
import { Group } from '../model/group.model';
import { User } from '../model/user.model';
import { ApiService } from './api.service';


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
  providedIn: 'root',
})
export class ProjectApiService extends ApiService {
  getProject(project_id: number): Observable<Project> {
    return this.http.get<Project>(`${this.REST_URL}/projects/${project_id}`);
  }

  getProjectsMatchTopic(topic: string): Observable<Project[]> {
    return this.getAllRessource(`${this.REST_URL}/projects?topic=${topic}`);
  }

  /** Dépréciée */
  getProjectsIdByTopic(topic: string): Observable<string[]> {
    const query = `{ projects(topics: "${topic}") { nodes { id } } }`;
    return this.http.post<ProjectsResponse>(this.graphql_url, { query }).pipe(
      map((rep) =>
        rep.data.projects.nodes
          .map((node) => {
            console.log(node);
            const match = RegExp(/(\d+)$/).exec(node.id);
            return match ? match[1] : null;
          })
          .filter((id): id is string => id !== null)
      )
    );
  }

  getProjectsMatchSearch(search: string): Observable<Project[]> {
    return this.getAllRessource(`${this.REST_URL}/projects?search=${search}&per_page=20`);
  }

  /** Dépréciée */
  searchProjects(search: string, amount: number = 20, page: number = 1): Observable<Project[]> {
    const buildUrl = (page: number) =>
      `${this.REST_URL}/projects?search=${search}&per_page=${amount}&page=${page}`;

    return this.http.get<Project[]>(buildUrl(page), { observe: 'response' }).pipe(
      switchMap((response) => {
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

        return forkJoin(requests).pipe(map((responses) => allProjects.concat(...responses)));
      })
    );
  }

  getProjectForks(project_id: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.REST_URL}/projects/${project_id}/forks`);
  }

  getProjectUsers(project_id: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.REST_URL}/projects/${project_id}/users`);
  }

  getProjectGroups(project_id: number): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.REST_URL}/projects/${project_id}/groups`);
  }



getReadmeProject(project_id: number): Observable<string> {
  return this.http.get<any[]>(`${this.REST_URL}/projects/${project_id}/repository/tree`).pipe(
    switchMap(items => {
      const readme = items.find(item => item.name.toLowerCase().startsWith("readme"));
      
      if (readme) {
        return this.http.get<any>(`${this.REST_URL}/projects/${project_id}/repository/files/${readme.path}?ref=HEAD`).pipe(
          map(fileData => {
            // Décodage base64 -> Uint8Array -> UTF-8 pour éviter les caractères cassés.
            const binary = atob(fileData.content);
            const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
            return new TextDecoder('utf-8').decode(bytes);
          })
        );
      } else {
        return of('readme indisponible');
      }
    })
  );
}
      





}
