import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from 'ngx-forge-map';

@Component({
  selector: 'app-utilisateur-information',
  imports: [CommonModule],
  templateUrl: './utilisateur-informations.component.html',
  styleUrl: './utilisateur-informations.component.scss',
})
export class UtilisateurInformation {

  @Input() user?: User;

  showProjects: boolean = false;

  toggleProjects() {
    this.showProjects = !this.showProjects;
  }
}
