import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Project } from '../model/project.model';

@Injectable({
  providedIn: 'root',
})
export class UserApiService extends ApiService {
  getUserProjects(user_path: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.REST_URL}/users/${user_path}/projects`);
  }

  getUserStatus(user_path: string): Observable<object> {
    console.warn('WIP - getUserStatus');
    return this.http.get(`${this.REST_URL}/users/${user_path}/status`);
  }
}
