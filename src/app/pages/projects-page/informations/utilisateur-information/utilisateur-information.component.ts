import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-utilisateur-information',
  imports: [CommonModule],
  templateUrl: './utilisateur-information.component.html',
  styleUrl: './utilisateur-information.component.scss',
})
export class UtilisateurInformation {
  @Input() utilisateurName: string = '';
  @Input() utilisateurWebUrl: string = '';
  @Input() utilisateurNombreProjets: number = 0;
  @Input() projectLinks: string[] = [];
  @Input() projects: any[] = [];

  showProjects: boolean = false;

  toggleProjects() {
    this.showProjects = !this.showProjects;
  }
}
