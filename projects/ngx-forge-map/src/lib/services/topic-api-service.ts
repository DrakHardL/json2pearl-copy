import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiService } from './api-service';


interface GraphQLTopicsResponse {
  data: {
    topics: {
      nodes: { name: string }[];
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class TopicApiService extends ApiService {
  getTopics(): Observable<string[]> {
    const query = `{ topics(search:""){ nodes { name } } }`;
    const url: string = this.graphql_url;

    return this.http.post<GraphQLTopicsResponse>(url, { query }).pipe(
      map(rep => rep.data.topics.nodes.map(t => t.name))
    );
  }

}