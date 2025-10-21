import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { expand, map, Observable, takeWhile } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  protected readonly REST_URL = 'https://forge.apps.education.fr/api/v4';
  protected readonly graphql_url = 'https://forge.apps.education.fr/api/graphql';

  constructor(protected readonly http: HttpClient) {}

  protected getAllRessource(url: string): Observable<any[]> {
    return this.getPage(url, 1).pipe(
      expand(({ nextPage }) => {
        return nextPage ? this.getPage(url, nextPage) : [];
      }),
      takeWhile(({ body }) => body && body.length > 0, true),
      map(({ body }) => body)
    );
  }

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
