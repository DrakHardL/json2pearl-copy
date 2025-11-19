import { UtilisateurInformation } from './informations/utilisateur-information/utilisateur-informations.component';
import { ProjectsInformations } from './informations/projects-informations/projects-informations';
import { GroupInformations } from './informations/group-informations/group-informations';
import { FloatingToolbar } from './floating-toolbar/floating-toolbar.component';
import { GraphForge, NodeShape, ProjectApiService } from 'ngx-forge-map';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToolBarItem as ToolbarItem } from './data/toolbar-item';
import { NodeColor } from './data/node-color';
import { finalize, Subscription } from 'rxjs';
import { NodeType } from './data/node-type';

@Component({
  selector: 'app-projects-page',
  imports: [FloatingToolbar, ProjectsInformations, GroupInformations, UtilisateurInformation],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss',
})
export class ProjectsComponent implements OnInit {
  @ViewChild('projectsChart', { static: true }) projects_chart!: ElementRef;
  protected projects_graph!: GraphForge;

  protected elements: any[] = [];
  protected selected_elements: any;
  protected isLoading: boolean = false;

  constructor(private readonly projectAPI: ProjectApiService) {}

  ngOnInit(): void {
    this.projects_graph = new GraphForge(this.projects_chart.nativeElement);
    this.projects_graph.onNodeDoubleClick().subscribe((id) => this.onDoubleClick(id));
    this.projects_graph.onNodeSelect().subscribe((id) => this.onSimpleClick(id));
  }

  protected onToolbarItemClicked(event: ToolbarItem): void {
    switch (event) {
      case ToolbarItem.DEVELOPPE:
        console.log('le bouton developpe est cliqué !!');

        return;
    }
    console.log('item clicked :', event);
  }

  protected onItemSelected(item: any, type: string): void {
    this.selected_elements = { ...item, type: type };
  }

  private current_search_request: Subscription | undefined;
  protected async onSearch(query: string) {
    if (query.length == 0) {
      return;
      // return this.showAllTopics();
    }
    if (this.current_search_request) {
      this.current_search_request.unsubscribe();
    }
    this.elements = [];
    this.projects_graph.clear();
    this.isLoading = true;
    this.current_search_request = await this.projectAPI
      .getProjectsMatchSearch(query)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((rep) => {
        console.log(rep);

        this.fill(rep);
      });
  }

  private fill(topics: any[]) {
    topics.forEach((topic) => {
      this.projects_graph.createNode(
        topic.name,
        NodeType.SUBJECT,
        NodeShape.HEXAGON,
        NodeColor.GROUP,
        topic,
        topic.total_projects_count
      );

      this.elements.push(topic);
    });
    // this.projects.sort((a: any, b: any) => b.total_projects_count - a.total_projects_count);
  }

  /** TODO implements this methods */
  private onDoubleClick(id: string): void {}
  private onSimpleClick(id: string): void {}
  private createNode(): void {}
  private createUser(): void {}
  private createProject(): void {}
  private createGroup(): void {}
}
