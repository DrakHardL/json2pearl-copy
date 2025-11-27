import { map, Observable, of, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';

import { Project } from '../model/project.model';
import { Group } from '../model/group.model';
import { User } from '../model/user.model';
import { ApiService } from './api.service';

/**
 * Service providing project-related API operations.
 *
 * Extends the base ApiService to perform REST and GraphQL calls related to projects,
 * including fetching project details, searching projects, retrieving forks, collaborators,
 * groups, and reading repository README files.
 *
 * All methods return RxJS Observables and are intended to be subscribed to by callers.
 *
 * @remarks
 * This service assumes REST endpoints are available via `this.REST_URL` and a GraphQL
 * endpoint via `this.graphql_url` (provided by the base ApiService).
 */
@Injectable({
  providedIn: 'root',
})
export class ProjectApiService extends ApiService {
  /**
   * Retrieve a single project by its numeric identifier.
   *
   * @param project_id - Numeric identifier of the project to retrieve.
   * @returns An Observable that emits the Project object for the given id.
   */
  getProject(project_id: number): Observable<Project> {
    return this.http.get<Project>(`${this.REST_URL}/projects/${project_id}`);
  }

  /**
   * Search for projects matching a specific topic.
   *
   * @param topic - Topic string used to filter projects (exact or tag match depending on API).
   * @returns An Observable that emits an array of Project objects matching the topic.
   */
  getProjectsMatchTopic(topic: string): Observable<Project[]> {
    return this.getAllRessource(`${this.REST_URL}/projects?topic=${topic}`);
  }

  /**
   * Search for projects using a free-text search query.
   *
   * @param search - Free-text search query.
   * @returns An Observable that emits an array of Project objects matching the search.
   *
   * @remarks
   * This method limits results to a page size of 20 (via the `per_page=20` query parameter).
   */
  getProjectsMatchSearch(search: string): Observable<Project[]> {
    return this.getAllRessource(`${this.REST_URL}/projects?search=${search}&per_page=20`);
  }

  /**
   * Get the forks of a given project.
   *
   * @param project_id - Numeric identifier of the project for which to retrieve forks.
   * @returns An Observable that emits an array of Project objects representing forks.
   */
  getProjectForks(project_id: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.REST_URL}/projects/${project_id}/forks`);
  }

  /**
   * Get the users associated with a given project.
   *
   * @param project_id - Numeric identifier of the project whose users are requested.
   * @returns An Observable that emits an array of User objects associated with the project.
   */
  getProjectUsers(project_id: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.REST_URL}/projects/${project_id}/users`);
  }

  /**
   * Get the groups associated with a given project.
   *
   * @param project_id - Numeric identifier of the project whose groups are requested.
   * @returns An Observable that emits an array of Group objects associated with the project.
   */
  getProjectGroups(project_id: number): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.REST_URL}/projects/${project_id}/groups`);
  }

  /**
   * Retrieve the repository README file content for a project, if present.
   *
   * The method:
   * - Lists the repository tree,
   * - Finds the first entry whose name starts with "readme" (case-insensitive),
   * - If found, fetches the file content and decodes it from Base64 to UTF-8 text,
   * - If not found, returns a default string indicating the README is unavailable.
   *
   * @param project_id - Numeric identifier of the project whose README should be retrieved.
   * @returns An Observable that emits the README file content as a UTF-8 string, or a fallback message.
   */
  getReadmeProject(project_id: number): Observable<string> {
    return this.http.get<any[]>(`${this.REST_URL}/projects/${project_id}/repository/tree`).pipe(
      switchMap((items) => {
        const readme = items.find((item) => item.name.toLowerCase().startsWith('readme'));

        if (readme) {
          return this.http
            .get<any>(
              `${this.REST_URL}/projects/${project_id}/repository/files/${readme.path}?ref=HEAD`
            )
            .pipe(
              map((fileData) => {
                const binary = atob(fileData.content);
                const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
                return new TextDecoder('utf-8').decode(bytes);
              })
            );
        } else {
          return of('readme indisponible');
        }
      })
    );
  }

  /**
   * Execute a GraphQL query to page through projects matching a search string.
   *
   * The query requests `pageInfo.endCursor` and, for each node, `isForked` and `id`.
   * The method wraps the HTTP POST and normalizes error responses by returning a shape
   * with an empty `data` object when an `error` property is present in the response.
   *
   * @param search - Free-text search string to filter projects.
   * @param cursor - Cursor string for pagination; passed as the `after` argument in the GraphQL query.
   * @returns An Observable that emits the raw GraphQL response (or a normalized object if an error is found).
   *
   * @remarks
   * The returned structure depends on the remote GraphQL schema; callers should
   * inspect `data.projects.pageInfo.endCursor` and `data.projects.nodes` for paging and node info.
   */
  getRootProjectsIdMathSearch(search: string, cursor: string) {
    const query: string = `{projects(search: "${search}", after: "${cursor}"){pageInfo{endCursor},nodes{isForked,id}}}`;
    return this.http.post<any>(`${this.graphql_url}?query=${query}`, '').pipe(
      map((rep) => {
        return rep['error'] ? { data: {} } : rep;
      })
    );
  }
}
