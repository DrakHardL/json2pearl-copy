import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as LZString from 'lz-string';
import { UrlManager } from '../../services/url-manager/url-manager';

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

    // this.route.queryParamMap.subscribe((params) => {
    //   this.urlManager.getUncodedUrlParams();
    //   const ids_projects = this.decompressUrlParametre(params.get('projects')!).split(',');
    //   const ids_users = this.decompressUrlParametre(params.get('users')!).split(',');
    //   const ids_groups = this.decompressUrlParametre(params.get('groups')!).split(',');

    //   const data = {
    //     projects: ids_projects,
    //     users: ids_users,
    //     groups: ids_groups,
    //   };

    // });
  }

  private redirect_projects_view(data: any): void {
    this.router.navigate(['/projects'], { state: { data: data } });
  }

  private decompressUrlParametre(parametre: string) {
    return LZString.decompressFromEncodedURIComponent(parametre);
  }
}
