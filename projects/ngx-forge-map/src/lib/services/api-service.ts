import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class ApiService {
  protected readonly rest_url = "https://forge.apps.education.fr/api/v4";
  protected readonly graphql_url = "https://forge.apps.education.fr/api/graphql";

  constructor(
    protected readonly http: HttpClient
  ) { }

}
