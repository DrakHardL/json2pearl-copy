import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GraphForge, NodeShape } from '../../model/graph-forge';
import { ProjectApiService } from '../../services/project.service';

/** Create a basic componant for display git-graph */
@Component({
  selector: 'lib-graph-demo',
  imports: [],
  templateUrl: './graph-demo.html',
  styleUrl: './graph-demo.css',
})
export class GraphDemo implements OnInit {
  @ViewChild('elementRef', { static: true }) elementRef!: ElementRef;
  private graphForge!: GraphForge;

  constructor(private readonly projectApi: ProjectApiService) {}

  ngOnInit(): void {
    this.graphForge = new GraphForge(this.elementRef.nativeElement);

    this.getExempleProject();
  }

  private getExempleProject(): void {
    this.projectApi.getProjectsMatchSearch('exemple').subscribe((projects) => {
      projects.forEach((project) => {
        this.graphForge.createNode(
          project.name,
          0,
          NodeShape.STAR,
          '#456424',
          project,
          Math.round(Math.random() * 100)
        );
      });
    });
  }
}
