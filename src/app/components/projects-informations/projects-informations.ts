import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-projects-informations',
  imports: [],
  templateUrl: './projects-informations.html',
  styleUrl: './projects-informations.scss'
})
export class ProjectsInformations {
  @Input() projectName: string = '';
}
