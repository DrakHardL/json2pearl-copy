import { expand, forkJoin, map, Observable, of, Subscription, switchMap } from 'rxjs';
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
      switchMap((items) => {
        const readme = items.find((item) => item.name.toLowerCase().startsWith('readme'));

        if (readme) {
          return this.http
            .get<any>(
              `${this.REST_URL}/projects/${project_id}/repository/files/${readme.path}?ref=HEAD`
            )
            .pipe(
              map((fileData) => {
                // Décodage base64 -> Uint8Array -> UTF-8 pour éviter les caractères cassés.
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

  getRootProjectsIdMathSearch(search: string, cursor: string) {
    const query: string = `{projects(search: "${search}", after: "${cursor}"){pageInfo{endCursor},nodes{isForked,id}}}`;
    return this.http.post<any>(`${this.graphql_url}?query=${query}`, '').pipe(
      map((rep) => {
        return rep['error'] ? { data: {} } : rep;
      })
    );
  }

  // getRootProjectsMathSearch(search: string, cursor: string = '') {
  //   const query = `{ projects(search: "${search}", after: "${cursor}") {
  //       pageInfo { endCursor }, nodes { isForked, id  } } } }`;

  //   return this.getPageGraphQL(query).pipe(
  //     expand((rep) => {
  //       console.log(rep);
  //       return [];
  //     }),
  //     map((rep) => {
  //       rep;
  //     })
  //   );

  //   interface Response {
  //     data: {
  //       projects: {
  //         pageInfo: {
  //           hasNextPage: boolean;
  //           endCursor: string;
  //         };
  //         nodes: {
  //           id: string;
  //           description: string;
  //           name: string;
  //           isForked: boolean;
  //           nameWithNamespace: string;
  //           path: string;
  //           createdAt: string;
  //           topics: [];
  //           sshUrlToRepo: string;
  //           httpUrlToRepo: string;
  //           webUrl: string;
  //           forksCount: number;
  //           avatarUrl: string;
  //           starCount: number;
  //           lastActivityAt: string;
  //           namespace: {
  //             id: string;
  //             name: string;
  //             path: string;
  //             fullPath: string;
  //             avatarUrl: string;
  //             webUrl: string;
  //           };
  //         }[];
  //       };
  //     };
  //   }

  //   return this.http.post<Response>(`${this.graphql_url}?query=${query}`, '').pipe(
  //     map((response) => {
  //       const elements = response.data.projects.nodes
  //         .filter((p) => !p.isForked)
  //         .map((elt) => {
  //           const project: Project = {
  //             id: elt.id as unknown as number,
  //             description: elt.description,
  //             name: elt.name,
  //             name_with_namespace: elt.nameWithNamespace,
  //             path: elt.path,
  //             path_with_namespace: elt.nameWithNamespace,
  //             created_at: elt.createdAt,
  //             default_branch: 'unset',
  //             tag_list: elt.topics,
  //             topics: elt.topics,
  //             ssh_url_to_repo: elt.sshUrlToRepo,
  //             http_url_to_repo: elt.httpUrlToRepo,
  //             web_url: elt.webUrl,
  //             readme_url: 'unset',
  //             forks_count: elt.forksCount,
  //             avatar_url: undefined,
  //             star_count: elt.starCount,
  //             last_activity_at: elt.lastActivityAt,
  //             namespace: {
  //               id: elt.namespace.id as unknown as number,
  //               name: elt.namespace.name,
  //               path: elt.namespace.path,
  //               kind: 'unset',
  //               full_path: elt.namespace.fullPath,
  //               parent_id: undefined,
  //               avatar_url: undefined,
  //               web_url: elt.webUrl,
  //             },
  //           };
  //           return project;
  //         });

  //       return { projects: elements, next: response.data.projects.pageInfo.endCursor };
  //     })
  //   );
  // }
}

// const query: string = `${this.graphql_url}?query={groups(ids:"gid://gitlab/Group/${id}"){nodes{groupMembers(search:""){nodes{user{id}}}}}}`;
// return this.http.post<any>(query, '').pipe(
//   map((response) => {
//     console.log(response);

//     const projects: any[] = response.data.projects.nodes;
//     const filteredProjects = projects.filter(project => !project.isForked);

//     console.log(filteredProjects);

//     const convertedProjects: Project[] = filteredProjects.map((p) => {
//       const gidMatch = /(\d+)$/.exec(p.id);
//       const id = gidMatch ? Number(gidMatch[1]) : Number(p.id) || 0;

//       return {
//         id,
//         name: p.name,
//         description: p.description ?? null,
//         path: p.path,
//         nameWithNamespace: p.nameWithNamespace,
//         createdAt: p.createdAt,
//         topics: p.topics ?? [],
//         sshUrlToRepo: p.sshUrlToRepo,
//         httpUrlToRepo: p.httpUrlToRepo,
//         webUrl: p.webUrl,
//         forksCount: p.forksCount ?? 0,
//         avatarUrl: p.avatarUrl ?? null,
//         starCount: p.starCount ?? 0,
//         lastActivityAt: p.lastActivityAt,
//         namespace: p.namespace ?? null,
//       } as unknown as Project;
//     });

//     return convertedProjects;

//     return {filteredProjects};

//     // const members =
//     //   response?.data?.groups?.nodes?.[0]?.groupMembers?.nodes?.map((member) => {
//     //     const userId = member.user.id.replace('gid://gitlab/User/', '');
//     //     return Number(userId);
//     //   }) || [];
//     return { response };
//   })
// );
