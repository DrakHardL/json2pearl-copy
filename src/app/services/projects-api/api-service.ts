import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Project } from '../../model/project-model';


@Injectable({
  providedIn: 'root'
})

export class ApiService {
  protected readonly base_url = "https://forge.apps.education.fr/api/v4";

  constructor(
    protected readonly http: HttpClient
  ) { }

  // ========== ==========  ========== ========== ========== //
  //                          PROJECT                        //
  // https://docs.gitlab.com/api/projects/#list-all-projects //
  //                                                         //
  // ========== ==========  ========== ========== ========== //

  /**
   * Get a list of public groups. By default, this request returns 20 results at a time.
   * @param amount Request returns results at a time.
   * @param page Number of current returns page.
   * @param skip_project Skip the group IDs passed.
   */
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

}
