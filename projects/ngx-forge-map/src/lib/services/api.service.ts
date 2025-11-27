import { HttpClient, HttpResponse } from '@angular/common/http';
import { expand, map, Observable, takeWhile } from 'rxjs';
import { Injectable } from '@angular/core';

/**
 * Service providing helper methods to interact with the Forge API (REST and GraphQL).
 *
 * This service centralizes HTTP calls to the Forge endpoints and provides utilities
 * for transparently iterating paginated REST resources.
 *
 * Remarks:
 * - Uses Angular's HttpClient for HTTP requests.
 * - Pagination follows the "x-next-page" response header; pages are fetched until no next page is provided
 *   or an empty body is returned.
 */
@Injectable({
  providedIn: 'root',
})
export abstract class ApiService {
  /** Base URL for the Forge REST API endpoints. */
  protected readonly REST_URL = 'https://forge.apps.education.fr/api/v4';

  /** URL for the Forge GraphQL endpoint. */
  protected readonly graphql_url = 'https://forge.apps.education.fr/api/graphql';

  /** Creates an instance of the ApiService. */
  constructor(protected readonly http: HttpClient) {}

  /**
   * Retrieve all pages of a paginated REST resource.
   *
   * This method starts fetching from page 1 and automatically follows pagination using the
   * "x-next-page" response header returned by the API. Each emitted value from the returned Observable
   * is the array of items from a single page. Consumers can accumulate pages into a single collection
   * if desired (for example using concatMap/mergeMap + toArray or reduce).
   *
   * Notes:
   * - The provided `url` should already contain any required query parameters except the `page` parameter,
   *   as the method appends `&page=<n>` when requesting pages.
   * - The observable completes when a page returns an empty body or when no `x-next-page` header indicates no further pages.
   *
   * @param url - The REST endpoint URL (without the page parameter).
   * @returns An Observable that emits the array of items for each fetched page.
   */
  protected getAllRessource(url: string): Observable<any[]> {
    return this.getPage(url, 1).pipe(
      expand(({ nextPage }) => {
        return nextPage ? this.getPage(url, nextPage) : [];
      }),
      takeWhile(({ body }) => body && body.length > 0, true),
      map(({ body }) => body)
    );
  }

  /**
   * Fetch a single page from a paginated REST endpoint.
   *
   * Performs an HTTP GET for the specified page and returns an object containing:
   * - body: the response body parsed as an array (defaults to an empty array if the body is null/undefined)
   * - nextPage: the number parsed from the "x-next-page" response header, or null if absent
   *
   * Important:
   * - The method appends `&page=<page>` to the provided `url` when issuing the request.
   *
   * @param url - The REST endpoint URL (should not include the page parameter).
   * @param page - Page number to request (1-based).
   * @returns Observable that resolves to an object with the page body and the nextPage number (or null).
   */
  private getPage(url: string, page: number): Observable<{ body: any[]; nextPage: number | null }> {
    return this.http
      .get<any[]>(`${url}&page=${page}`, {
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<any[]>) => {
          const nextPageHeader = response.headers.get('x-next-page');
          const nextPage = nextPageHeader ? Number(nextPageHeader) : null;
          return { body: response.body || [], nextPage };
        })
      );
  }
}
