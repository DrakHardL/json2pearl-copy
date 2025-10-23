import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GraphForge, NodeShape, ProjectApiService } from 'ngx-forge-map';

enum NodeColor {
  PROJECT = '#E0AC54',
  USER = '#78B1DD',
  GROUP = '#55D764',
}

enum NodeType {
  PROJECT,
  USER,
  GROUP,
}

@Component({
  selector: 'app-test-project-finder',
  imports: [],
  templateUrl: './test-project-finder.component.html',
  styleUrl: './test-project-finder.component.scss',
})
export class TestProjectFinder implements OnInit {
  private route = inject(ActivatedRoute);
  protected topic: string = '';

  @ViewChild('visNetwork', { static: true }) visNetwork!: ElementRef;

  network!: GraphForge;

  constructor(private readonly projectsAPI: ProjectApiService) {}

  ngOnInit(): void {
    this.network = new GraphForge(this.visNetwork.nativeElement);
    this.route.queryParams.subscribe((params) => {
      this.topic = params['topic'] || '';

      this.projectsAPI.getProjectsMatchTopic(this.topic).subscribe((projects) => {
        projects.forEach((project) => {
          this.createNode(
            project.name,
            NodeType.PROJECT,
            NodeShape.SQUARE,
            NodeColor.PROJECT,
            project
          );
        });
      });
    });
  }

  private createNode(
    label: string,
    type: number,
    shape: NodeShape,
    color: string,
    data: any
  ): string {
    return this.network.createNode(label, type, shape, color, data);
  }

}
