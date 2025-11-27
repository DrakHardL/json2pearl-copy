import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Project } from '../model/project.model';
import { ApiService } from './api.service';

/**
 * Service providing user-related API operations.
 *
 * Extends the base ApiService to use the application's REST_URL and HttpClient.
 * This service is provided in the root injector and exposes methods to retrieve
 * user projects and user status from the backend.
 *
 * @remarks
 * - All methods return RxJS Observables that emit the parsed response from the server.
 * - HTTP errors are propagated through the returned Observables and should be handled by subscribers.
 */
@Injectable({
  providedIn: 'root',
})
export class UserApiService extends ApiService {
  /**
   * Retrieve the list of projects associated with a given user.
   *
   * Sends a GET request to the backend endpoint at `/users/{user_path}/projects` and
   * returns an Observable that emits an array of Project models parsed from the response.
   *
   * @param user_path - The unique path or identifier for the user whose projects are requested.
   *                    This value is interpolated into the request URL and must be URL-safe.
   * @returns An Observable that emits an array of Project objects on success.
   */
  getUserProjects(user_path: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.REST_URL}/users/${user_path}/projects`);
  }

  /**
   * Retrieve the status information for a given user.
   *
   * Sends a GET request to the backend endpoint at `/users/{user_path}/status` and returns
   * an Observable that emits the raw status object returned by the server.
   *
   * @remarks
   * - This API is currently marked as WIP (work in progress) and the returned structure may change.
   * - A console warning is emitted when this method is invoked to indicate its unstable status.
   * - Consumers should treat the returned object as an opaque payload until its schema is stabilized.
   *
   * @param user_path - The unique path or identifier for the user whose status is requested.
   * @returns An Observable that emits the server-provided status object.
   */
  getUserStatus(user_path: string): Observable<object> {
    console.warn('WIP - getUserStatus');
    return this.http.get(`${this.REST_URL}/users/${user_path}/status`);
  }
}
