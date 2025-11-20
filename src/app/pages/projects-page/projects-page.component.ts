import { UtilisateurInformation } from './informations/utilisateur-information/utilisateur-informations.component';
import { GroupInformations } from './informations/group-informations/group-informations';
import { FloatingToolbar } from './floating-toolbar/floating-toolbar.component';
import {
  GraphForge,
  GroupApiService,
  NodeShape,
  ProjectApiService,
  UserApiService,
} from 'ngx-forge-map';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToolBarItem as ToolbarItem } from './data/toolbar-item';
import { NodeColor } from './data/node-color';
import { finalize, Subscription } from 'rxjs';
import { NodeType } from './data/node-type';
import { MarkdownModule } from 'ngx-markdown';
import { ProjectsInformations } from './informations/projects-informations/projects-informations';

@Component({
  selector: 'app-projects-page',
  imports: [
    FloatingToolbar,
    GroupInformations,
    UtilisateurInformation,
    MarkdownModule,
    ProjectsInformations,
  ],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss',
})
export class ProjectsComponent implements OnInit {
  @ViewChild('projectsChart', { static: true }) projects_chart!: ElementRef;
  protected projects_graph!: GraphForge;

  protected elements: any[] = [];
  protected selected_elements: any;
  protected isLoading: boolean = false;

  constructor(
    private readonly projectAPI: ProjectApiService,
    private readonly groupAPI: GroupApiService,
    private readonly userAPI: UserApiService
  ) {}

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
    console.log(this.selected_elements);
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
        this.fill(rep);
      });
  }

  private fill(elts: any[]) {
    elts.forEach((elt) => {
      this.createProject(elt);
      this.elements.push(elt);
    });
  }

  private onSimpleClick(id: string): void {
    const node_type = this.projects_graph.getNodeType(id);

    if (node_type == NodeType.PROJECT) {
      this.selected_elements = { ...this.projects_graph.getNodeDataByID(id), type: 'project' };
      return;
    }

    if (node_type == NodeType.GROUP) {
      this.selected_elements = { ...this.projects_graph.getNodeDataByID(id), type: 'group' };
      return;
    }

    if (node_type == NodeType.USER) {
      this.selected_elements = { ...this.projects_graph.getNodeDataByID(id), type: 'user' };
      return;
    }
  }

  private onDoubleClick(id_1: string): void | Subscription {
    if (!id_1) return;

    const node_id = this.projects_graph.getNodeID(id_1);
    const node_type = this.projects_graph.getNodeType(id_1);

    if (node_type == NodeType.PROJECT) {
      this.projectAPI.getProjectUsers(node_id).subscribe((users) => {
        users.forEach((user) => {
          const id_2 = this.createUser(user);
          this.connect2nodes(id_1, id_2);
        });
      });

      return this.projectAPI.getProjectGroups(node_id).subscribe((groups) => {
        groups.forEach((group) => {
          const id_2 = this.createGroup(group);
          this.connect2nodes(id_1, id_2);
        });
      });
    }

    if (node_type == NodeType.USER) {
      return this.userAPI.getUserProjects(node_id.toString()).subscribe((projects) => {
        projects.forEach((project) => {
          const id_2 = this.createProject(project);
          this.connect2nodes(id_1, id_2);
        });
      });
    }

    if (node_type == NodeType.GROUP) {
      return this.groupAPI.getGroupProjects(node_id).subscribe((projects) => {
        projects.forEach((project) => {
          const id_2 = this.createProject(project);
          this.connect2nodes(id_1, id_2);
        });
      });
    }
  }

  private createNode(elt: any, type: NodeType, shape: NodeShape, color: NodeColor): string {
    return this.projects_graph.createNode(elt.name, type, shape, color, elt);
  }

  private createUser(user: any): string {
    return this.createNode(user, NodeType.USER, NodeShape.DOT, NodeColor.USER);
  }

  private connect2nodes(id_1: string, id_2: string): void {
    return this.projects_graph.connectNodes(id_1, id_2);
  }

  private createProject(project: any): string {
    return this.createNode(project, NodeType.PROJECT, NodeShape.SQUARE, NodeColor.PROJECT);
  }

  private createGroup(group: any): string {
    return this.createNode(group, NodeType.GROUP, NodeShape.TRIANGLE, NodeColor.GROUP);
  }
}
