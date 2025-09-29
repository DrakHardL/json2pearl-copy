import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects-informations',
  imports: [CommonModule],
  templateUrl: './projects-informations.html',
  styleUrl: './projects-informations.scss'
})
export class ProjectsInformations {
  @Input() projectName: string = '';
  @Input() projectDescription: string = '';
  @Input() projectThematic: string = '';
  @Input() projectVersion: string = '';
  @Input() projectCreatedDate: string = '';
  @Input() projectCreator: string = '';
  @Input() projectOriginalLink: string = '';
}
