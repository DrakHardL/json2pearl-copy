import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GraphForge, Project, ProjectApiService } from 'ngx-forge-map';

@Component({
  selector: 'app-modele-page',
  imports: [],
  templateUrl: './modele-page.html',
  styleUrl: './modele-page.scss',
})
export class ModelePage implements OnInit {
  @ViewChild('modeleRef', { static: true }) modeleRef!: ElementRef;
  private modeleGraph!: GraphForge;

  constructor(private readonly projectApiService: ProjectApiService) {}

  ngOnInit(): void {
    this.modeleGraph = new GraphForge(this.modeleRef.nativeElement);
    this.modeleGraph.onNodeDoubleClick().subscribe((id) => this.onDoubleClick(id));

    this.projectApiService.getProjectsMatchTopic('modèle').subscribe((projects) => {
      this.displayProjects(projects);
      console.log(projects);
    });
  }

  private onDoubleClick(node_id: string): void {
    const id: number = this.modeleGraph.getNodeID(node_id);
    this.projectApiService.getProjectForks(id).subscribe((projects) => {
      const ids = this.displayProjects(projects);
      ids.forEach((id) => {
        this.modeleGraph.connectNodes(node_id, id);
      });
    });
  }

  private displayProjects(projects: Project[]): string[] {
    const ids: string[] = [];
    projects.forEach((project) => {
      ids.push(this.modeleGraph.createProject(project));
    });
    return ids;
  }
}
