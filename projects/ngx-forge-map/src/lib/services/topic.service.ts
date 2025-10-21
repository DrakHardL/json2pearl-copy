import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Topic } from '../model/topic.model';

@Injectable({
  providedIn: 'root',
})
export class TopicApiService extends ApiService {
  getTopics(): Observable<Topic[]> {
    return this.getAllRessource(`${this.REST_URL}/topics`);
  }

  getTopicsMatchSearch(search: string): Observable<Topic[]> {
    return this.getAllRessource(`${this.REST_URL}/topics?search=${search}`);
  }
}
