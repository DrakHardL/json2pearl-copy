import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as LZString from 'lz-string';

@Component({
  selector: 'app-favoris',
  imports: [],
  templateUrl: './favoris-page.component.html',
  styleUrl: './favoris-page.component.scss',
})
export class FavorisComponent implements OnInit {
  constructor(private readonly router: Router, private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const ids_projects = this.decompressUrlParametre(params.get('projects')!).split(',');
      const ids_users = this.decompressUrlParametre(params.get('users')!).split(',');
      const ids_groups = this.decompressUrlParametre(params.get('groups')!).split(',');

      const data = {
        projects: ids_projects,
        users: ids_users,
        groups: ids_groups,
      };

      this.redirect_projects_view(data);
    });
  }

  private redirect_projects_view(data: any): void {
    this.router.navigate(['/projects'], { state: { data: data } });
  }

  private decompressUrlParametre(parametre: string) {
    return LZString.decompressFromEncodedURIComponent(parametre);
  }
}
