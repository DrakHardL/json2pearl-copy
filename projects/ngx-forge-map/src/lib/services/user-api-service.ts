import { Injectable } from '@angular/core';
import { ApiService } from '../api-service';
import { Observable } from 'rxjs';
import { Project } from '../model/model-project';

@Injectable({
  providedIn: 'root'
})
export class UserApiService extends ApiService {

  getUserProjects(user_path: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.base_url}/users/${user_path}/projects`);
  }

  getUserStatus(user_path: string): Observable<object> {
    console.warn("WIP - getUserStatus");
    return this.http.get(`${this.base_url}/users/${user_path}/status`);
  }

}
