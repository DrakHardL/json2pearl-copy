import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api-service';
import { Project } from '../model/model-project';
import { Group } from '../model/model-group';


@Injectable({
  providedIn: 'root'
})
export class GroupApiService extends ApiService {

  // getAllGroups(
  //   amount: number = 20,
  //   page: number = 1,
  //   skip_groups: number[] = []
  // ): Observable<Group[]> {
  //   const skipGroupsParam = skip_groups.length > 0 ? `&skip_groups=${skip_groups.join(',')}` : '';
  //   return this.http.get<Group[]>(
  //     `${this.rest_url}/groups?per_page=${amount}&page=${page}${skipGroupsParam}`
  //   );
  // }

  searchGroups(
    search: string,
    amount: number = 20,
    page: number = 1,
    skip_groups: number[] = []
  ): Observable<Group[]> {
    const skipGroupsParam = skip_groups.length > 0 ? `&skip_groups=${skip_groups.join(',')}` : '';
    return this.http.get<Group[]>(
      `${this.rest_url}/groups?search=${search}&per_page=${amount}&page=${page}${skipGroupsParam}`
    );
  }

  getGroupProjects(
    id: number,
    amount: number = 20,
    page: number = 1,
  ): Observable<Project[]> {
    return this.http.get<Project[]>(
      `${this.rest_url}/groups/${id}/projects?page=${page}&per_page=${amount}`
    );
  }

  getGroup(id: number): Observable<Group> {
    return this.http.get<Group>(`${this.rest_url}/groups/${id}`);
  }

}
