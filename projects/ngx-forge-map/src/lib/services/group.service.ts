import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Project } from '../model/project.model';
import { Group } from '../model/group.model';
import { ApiService } from './api.service';

/**
 * Service providing group-related API operations against the GitLab REST and GraphQL endpoints.
 *
 * Extends ApiService to reuse common REST/GraphQL URL and HTTP helpers.
 *
 * Responsibilities:
 * - Query groups by search terms.
 * - Fetch group details, projects and members.
 * - Translate GraphQL gid://gitlab URIs to numeric user IDs.
 *
 * Note: All network calls return Observables from Angular's HttpClient.
 */
@Injectable({
  providedIn: 'root',
})
export class GroupApiService extends ApiService {
  /**
   * Retrieve a short list of groups matching the provided search term using the generic resource loader.
   *
   * @param search - The search term used to match group names or paths.
   * @returns An Observable that emits the API response from the underlying getAllRessource call.
   *          The exact shape depends on the server and the implementation of getAllRessource.
   * @remarks This call requests up to 20 results (per_page=20).
   */
  getGroupMatchSearch(search: string) {
    return this.getAllRessource(`${this.REST_URL}/groups?search=${search}&per_page=20`);
  }

  /**
   * Fetch projects that belong to a given group.
   *
   * @param id - Numeric ID of the group.
   * @param amount - Number of projects per page (per_page). Default is 20.
   * @param page - Page number to retrieve. Default is 1.
   * @returns Observable<Project[]> that emits a page of Project objects for the group.
   */
  getGroupProjects(id: number, amount: number = 20, page: number = 1): Observable<Project[]> {
    return this.http.get<Project[]>(
      `${this.REST_URL}/groups/${id}/projects?page=${page}&per_page=${amount}`
    );
  }

  /**
   * Retrieve the details of a single group by its numeric ID.
   *
   * @param id - Numeric ID of the group to fetch.
   * @returns Observable<Group> that emits the Group object for the given ID.
   */
  getGroup(id: number): Observable<Group> {
    return this.http.get<Group>(`${this.REST_URL}/groups/${id}`);
  }

  /**
   * Retrieve the numeric user IDs of members of a group via the GraphQL API.
   *
   * @param id - Numeric ID of the group.
   * @returns Observable<{ members: number[] }> that emits an object containing
   *          a `members` array of numeric user IDs.
   * @remarks
   * - This method calls the GraphQL endpoint and expects user IDs in the form "gid://gitlab/User/<id>".
   *   It strips the prefix and converts the remaining part to Number.
   * - If no members are returned, `members` will be an empty array.
   */
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

  /**
   * Retrieve members of a group via the GraphQL API with basic user information.
   *
   * @param id - Numeric ID of the group.
   * @returns Observable<{ members: { id: number; name: string; webUrl: string }[] }> that emits an object
   *          with a `members` array containing objects for each user with numeric `id`, `name`, and `webUrl`.
   * @remarks
   * - This method calls the GraphQL endpoint and normalizes user IDs by removing the
   *   "gid://gitlab/User/" prefix then converting to Number.
   * - The returned `members` array will be empty if the group has no members or the response shape differs.
   * - The method logs the raw response and the mapped members to the console (for debugging).
   */
  getGroupMembers(id: number): Observable<any> {
    const url: string = `${this.graphql_url}?query={groups(ids:"gid://gitlab/Group/${id}"){nodes{groupMembers(search:""){nodes{user{id,name,webUrl}}}}}}`;

    return this.http
      .post<{
        data: {
          groups: {
            nodes: {
              groupMembers: { nodes: { user: { id: string; name: string; webUrl: string } }[] };
            }[];
          };
        };
      }>(url, '')
      .pipe(
        map((response) => {
          const members =
            response?.data?.groups?.nodes?.[0]?.groupMembers?.nodes?.map((member) => {
              const userId = member.user.id.replace('gid://gitlab/User/', '');
              return { id: Number(userId), name: member.user.name, webUrl: member.user.webUrl };
            }) || [];
          return {
            members,
          };
        })
      );
  }
}
