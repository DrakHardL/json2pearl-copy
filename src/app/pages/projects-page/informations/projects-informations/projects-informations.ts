import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Project, ProjectApiService } from 'ngx-forge-map';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-projects-informations',
  imports: [MarkdownModule],
  templateUrl: './projects-informations.html',
  styleUrl: './projects-informations.scss',
})
export class ProjectsInformations implements OnInit, OnChanges {
  @Input() project?: Project;

  constructor(private readonly projectAPI: ProjectApiService) {}
  protected readme: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project']) {
      this.getReadme();
    }
  }

  ngOnInit(): void {
    this.getReadme();
  }

  protected getReadme(): void {
    this.projectAPI.getReadmeProject(this.project!.id).subscribe((readme) => {
      this.readme = readme;
    });
  }
}
