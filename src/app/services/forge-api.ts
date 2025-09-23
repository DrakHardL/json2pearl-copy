import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ForgeApiService {
  private static readonly base_url = "https://forge.apps.education.fr/api/v4";
}
