import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Project } from '../model/project.model';
import { Group } from '../model/group.model';

@Injectable({
  providedIn: 'root',
})
export class GroupApiService extends ApiService {
  getGroupMatchSearch(search: string) {
    return this.getAllRessource(`${this.REST_URL}/groups?search=${search}&per_page=20`);
  }

  /** Dépréciée */
  searchGroups(
    search: string,
    amount: number = 20,
    page: number = 1,
    skip_groups: number[] = []
  ): Observable<Group[]> {
    const skipGroupsParam = skip_groups.length > 0 ? `&skip_groups=${skip_groups.join(',')}` : '';
    return this.http.get<Group[]>(
      `${this.REST_URL}/groups?search=${search}&per_page=${amount}&page=${page}${skipGroupsParam}`
    );
  }

  getGroupProjects(id: number, amount: number = 20, page: number = 1): Observable<Project[]> {
    return this.http.get<Project[]>(
      `${this.REST_URL}/groups/${id}/projects?page=${page}&per_page=${amount}`
    );
  }

  getGroup(id: number): Observable<Group> {
    return this.http.get<Group>(`${this.REST_URL}/groups/${id}`);
  }

  getGroupMembersID(id: number) {
    const url: string = `${this.graphql_url}?query={groups(ids:"gid://gitlab/Group/${id}"){nodes{groupMembers(search:""){nodes{user{id}}}}}}`;

    interface t {
      data: { groups: { nodes: { groupMembers: { nodes: { user: { id: string } }[] } }[] } };
    }
    return this.http.post<t>(url, '').pipe(
      map((response) => {
        const members =
          response?.data?.groups?.nodes?.[0]?.groupMembers?.nodes?.map((member) => {
            const userId = member.user.id.replace('gid://gitlab/User/', '');
            return Number(userId);
          }) || [];
        return { members };
      })
    );
  }
}
