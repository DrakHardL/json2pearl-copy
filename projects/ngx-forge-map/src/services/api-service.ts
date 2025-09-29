import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class ApiService {
  protected readonly base_url = "https://forge.apps.education.fr/api/v4";

  constructor(
    protected readonly http: HttpClient
  ) { }

}
