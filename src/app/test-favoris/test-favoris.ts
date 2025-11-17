import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as LZString from 'lz-string';

@Component({
  selector: 'app-test-favoris',
  imports: [],
  templateUrl: './test-favoris.html',
  styleUrl: './test-favoris.scss',
})
export class TestFavoris implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {

      const ids_projects = LZString.decompressFromEncodedURIComponent(params.get('projects')!)?.split(',');
      const ids_users = LZString.decompressFromEncodedURIComponent(params.get('users')!)?.split(',');
      const ids_groups = LZString.decompressFromEncodedURIComponent(params.get('groups')!)?.split(',');

      const data = {
        projects: ids_projects,
        users: ids_users,
        groups: ids_groups,
      }

      this.redirect_projects_view(data);
    });
  }

  private redirect_projects_view(data: any): void {
    this.router.navigate(['/projects'], { state: { data: data } });
  }
}
