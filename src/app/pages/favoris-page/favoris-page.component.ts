import { UrlManager } from '../../services/url-manager/url-manager';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-favoris',
  imports: [],
  templateUrl: './favoris-page.component.html',
  styleUrl: './favoris-page.component.scss',
})
export class FavorisComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly urlManager: UrlManager
  ) {}

  ngOnInit(): void {
    const params = this.urlManager.getUncodedUrlParams((e: string) => {
      return e != '' ? e.split(',').map((e) => Number(e)) : [];
    });

    this.redirect_projects_view(params);
  }

  private redirect_projects_view(data: any): void {
    this.router.navigate(['/projects'], { state: { data: data } });
  }
}
