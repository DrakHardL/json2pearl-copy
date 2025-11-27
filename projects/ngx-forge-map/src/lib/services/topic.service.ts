import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Topic } from '../model/topic.model';
import { ApiService } from './api.service';

/**
 * Service for interacting with the Topics REST API.
 *
 * Extends the base ApiService to provide topic-specific operations such as
 * fetching a paginated list of topics, retrieving a single topic by id, and
 * searching topics. This service is provided in the root injector.
 *
 * @remarks
 * All network calls use the REST_URL base defined on the ApiService.
 */
@Injectable({
  providedIn: 'root',
})
export class TopicApiService extends ApiService {
  /**
   * Retrieve a page of topics.
   *
   * Uses a fixed page size of 20 via the query parameter `per_page=20`.
   *
   * @returns An Observable that emits an array of Topic objects.
   */
  getTopics(): Observable<Topic[]> {
    return this.getAllRessource(`${this.REST_URL}/topics?per_page=20`);
  }

  /**
   * Retrieve a single topic by its identifier.
   *
   * @param id - The numeric identifier of the topic to fetch.
   * @returns An Observable that emits the requested Topic.
   */
  getTopic(id: number): Observable<Topic> {
    return this.http.get<Topic>(`${this.REST_URL}/topics/${id}`);
  }

  /**
   * Retrieve link information related to a given topic.
   *
   * @param id - The numeric identifier of the topic for which to fetch links.
   * @remarks
   * Implementation is currently a placeholder — should return an Observable
   * containing the topic's related links (or an appropriate error/empty result).
   */
  getTopicLinks(id: number) {}

  /**
   * Search topics by a text query.
   *
   * Sends the given search string as the `search` query parameter to the topics
   * endpoint and returns matching topics.
   *
   * @param search - The search string used to match topics.
   * @returns An Observable that emits an array of Topic objects that match the search.
   */
  getTopicsMatchSearch(search: string): Observable<Topic[]> {
    return this.getAllRessource(`${this.REST_URL}/topics?search=${search}`);
  }
}
