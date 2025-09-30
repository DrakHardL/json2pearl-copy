import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';

import { Project } from '../model/model-project';
import { Group } from '../model/model-group';
import { User } from '../model/model-user';
import { ApiService } from './api-service';


@Injectable({
  providedIn: 'root'
})
export class ProjectApiService extends ApiService {

  // getAllProjects(amount: number = 20, skip_project: number[] = []): Observable<Project[]> {
  //   const baseUrl = `${this.rest_url}/projects`;
  //   const skipParam = skip_project.length > 0 ? `&skip_projects=${skip_project.join(',')}` : '';

  //   const buildUrl = (page: number) =>
  //     `${baseUrl}?per_page=${amount}&page=${page}${skipParam}`;

  //   return this.http.get<Project[]>(buildUrl(1), { observe: 'response' }).pipe(
  //     switchMap(response => {
  //       const totalPages = Number(response.headers.get('x-total-pages')) || 1;

  //       // on récupère déjà les projets de la première page
  //       const allProjects: Project[] = response.body || [];

  //       if (totalPages <= 1) {
  //         return of(allProjects);
  //       }

  //       // préparer les requêtes pour les autres pages
  //       const requests: Observable<Project[]>[] = [];
  //       for (let page = 2; page <= totalPages; page++) {
  //         requests.push(this.http.get<Project[]>(buildUrl(page)));
  //       }

  //       // exécuter toutes les requêtes en parallèle et concaténer les résultats
  //       return forkJoin(requests).pipe(
  //         map(responses => allProjects.concat(...responses))
  //       );
  //     })
  //   );
  // }

  getProject(project_id: number): Observable<Project> {
    return this.http.get<Project>(`${this.rest_url}/projects/${project_id}`);
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

        // on récupère déjà les projets de la première page
        const allProjects: Project[] = response.body || [];

        if (totalPages <= 1) {
          return of(allProjects);
        }

        // préparer les requêtes pour les autres pages
        const requests: Observable<Project[]>[] = [];
        for (let page = 2; page <= totalPages; page++) {
          requests.push(this.http.get<Project[]>(buildUrl(page)));
        }

        // exécuter toutes les requêtes en parallèle et concaténer les résultats
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
