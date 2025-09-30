import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-utilisateur-information',
  imports: [CommonModule],
  templateUrl: './utilisateur-information.html',
  styleUrl: './utilisateur-information.scss'
})
export class UtilisateurInformation {


  //on recoit les informations de app.ts
  @Input() utilisateurName: string = '';
  @Input() utilisateurWebUrl: string = '';
  @Input() utilisateurNombreProjets: number = 0;
  @Input() projectLinks: string[] = [];




}
