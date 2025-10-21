import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Topic } from '../model/topic.model';

@Injectable({
  providedIn: 'root',
})
export class TopicApiService extends ApiService {
  getTopics(): Observable<Topic[]> {
    return this.getAllRessource(`${this.REST_URL}/topics?per_page=20`);
  }

  getTopic(id: number): Observable<Topic> {
    return this.http.get<Topic>(`${this.REST_URL}/topics/${id}`);
  }

  getTopicsMatchSearch(search: string): Observable<Topic[]> {
    return this.getAllRessource(`${this.REST_URL}/topics?search=${search}`);
  }
}
