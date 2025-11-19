import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { Project } from 'ngx-forge-map';

@Component({
  selector: 'app-projects-informations',
  imports: [CommonModule, MarkdownModule],
  templateUrl: './projects-informations.html',
  styleUrl: './projects-informations.scss',
})
export class ProjectsInformations {
  @Input() project?: Project;
}
