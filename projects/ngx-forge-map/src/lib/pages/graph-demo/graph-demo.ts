import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GraphForge, NodeShape } from '../../model/graph-forge';
import { ProjectApiService } from '../../services/project.service';

/**
 * GraphDemo Angular component used to render a demonstration graph based on example projects.
 *
 * This component:
 * - Instantiates a GraphForge instance bound to a DOM element referenced via ViewChild.
 * - Queries the ProjectApiService for projects matching the search term "exemple".
 * - Creates a visual node in the graph for each matching project using GraphForge.createNode.
 *
 * Usage:
 * <lib-graph-demo></lib-graph-demo>
 *
 * Behavior and responsibilities:
 * - On initialization (ngOnInit) the component creates the GraphForge canvas using the element referenced
 *   by `elementRef` and then loads example projects.
 * - getExempleProject subscribes to ProjectApiService.getProjectsMatchSearch('exemple') and, for each
 *   returned project, creates a node with:
 *     - label: project.name
 *     - z-index or layer: 0
 *     - shape: NodeShape.STAR
 *     - color: '#456424'
 *     - payload: the project object
 *     - a randomly generated numeric weight between 0 and 100
 *
 * Notes:
 * - The component assumes `elementRef` is available at component instantiation (ViewChild with { static: true }).
 * - The graph creation is side-effecting and depends on the ProjectApiService observable stream.
 * - Error handling, unsubscribe logic (if needed) and more deterministic node positioning/weighting are not handled here.
 *
 * Members:
 * - elementRef: ElementRef — reference to the host DOM element used to initialize GraphForge.
 * - graphForge: GraphForge — instance created and used to manipulate the graph.
 * - constructor(projectApi: ProjectApiService) — injects the project API used to fetch example projects.
 * - ngOnInit(): void — lifecycle hook that creates the GraphForge instance and triggers data loading.
 * - private getExempleProject(): void — helper that subscribes to the project API and creates graph nodes.
 */
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
