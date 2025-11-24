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
import { expand, finalize, firstValueFrom, map, Observable, Subscription, takeWhile } from 'rxjs';
import { NodeType } from './data/node-type';
import { MarkdownModule } from 'ngx-markdown';
import { ProjectsInformations } from './informations/projects-informations/projects-informations';
import { Route } from '@angular/router';
import * as LZString from 'lz-string';
import { Router } from '@angular/router';

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
  protected selected_user_projects: any[] = [];

  private current_user_projects_request: Subscription | undefined;
  constructor(
    private readonly projectAPI: ProjectApiService,
    private readonly groupAPI: GroupApiService,
    private readonly userAPI: UserApiService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.projects_graph = new GraphForge(this.projects_chart.nativeElement);

    this.projects_graph.onNodeDoubleClick().subscribe((id) => this.onDoubleClick(id));
    this.projects_graph.onNodeSelect().subscribe((id) => this.onSimpleClick(id));

    if (history.state.data) {
      return this.load_state();
    }
  }

  private load_state(): void {
    let ids_projects: string[] = history.state.data.projects || [];
    if (ids_projects[0] == '') {
      ids_projects = [];
    }
    let ids_users: string[] = history.state.data.users || [];
    if (ids_users[0] == '') {
      ids_users = [];
    }
    let ids_groups: string[] = history.state.data.groups || [];
    if (ids_groups[0] == '') {
      ids_groups = [];
    }

    ids_projects.forEach((id) => {
      this.projectAPI.getProject(id as unknown as number).subscribe((project) => {
        const id_1 = this.createProject(project);

        this.projectAPI.getProjectUsers(id as unknown as number).subscribe((users) => {
          users.forEach((user) => {
            if (ids_users.indexOf(user.id.toString()) != -1) {
              const id_2 = this.createUser(user);
              this.connect_2_nodes(id_1, id_2);
            }
          });
        });
        this.projectAPI.getProjectGroups(id as unknown as number).subscribe((groups) => {
          groups.forEach((group) => {
            if (ids_groups.indexOf(group.id.toString()) != -1) {
              const id_2 = this.createGroup(group);
              this.connect_2_nodes(id_1, id_2);
            }
          });
        });
      });
    });
  }

  private connect_2_nodes(id_1: string, id_2: string) {
    return this.projects_graph.connectNodes(id_1, id_2);
  }

  private fetchAllRootProjectIDMathSearch(search: string): Observable<any> {
    return this.getPage(search, '').pipe(
      expand(({ next }) => (next ? this.getPage(search, next) : [])),
      map(({ rep }) => rep)
    );
  }

  private getPage(search: string, cursor: string = '') {
    return this.projectAPI.getRootProjectsIdMathSearch(search, cursor).pipe(
      map((rep: any) => {
        const requests: number[] = rep?.data?.projects?.nodes
          .filter((p: { isForked: boolean; id: string }) => !p.isForked)
          .map((p: { isForked: boolean; id: string }) => {
            const projectId = Number(p.id.split('/').pop());
            return projectId;
          });
        return { rep: requests, next: rep?.data?.projects?.pageInfo?.endCursor as string };
      })
    );
  }

  protected onToolbarItemClicked(event: ToolbarItem): void {
    switch (event) {
      case ToolbarItem.DEVELOPPE:
        return;

      case ToolbarItem.HIDE:
        return this.onHideToolClicked();

      case ToolbarItem.FAVORIS:
        return this.onCopyLinkClicked();
    }
  }

  private onCopyLinkClicked(): void {
    const ids_projects = this.projects_graph.getNodesIDByType(NodeType.PROJECT);
    const ids_users = this.projects_graph.getNodesIDByType(NodeType.USER);
    const ids_groups = this.projects_graph.getNodesIDByType(NodeType.GROUP);

    const url2 = this.router.createUrlTree(['favoris'], {
      queryParams: {
        projects: LZString.compressToEncodedURIComponent(ids_projects.join(',')),
        users: LZString.compressToEncodedURIComponent(ids_users.join(',')),
        groups: LZString.compressToEncodedURIComponent(ids_groups.join(',')),
      },
    });

    const finalUrl = window.location.origin + this.router.serializeUrl(url2);

    // Copier dans le presse-papiers
    navigator.clipboard.writeText(finalUrl);
  }

  private onHideToolClicked(): void {
    this.projects_graph.getSelectedNodes().forEach((node_id) => {
      this.projects_graph.removeNode(node_id);
    });
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
    this.selected_user_projects = [];

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
      this.loadUserProjects(this.projects_graph.getNodeID(id));
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

  private loadUserProjects(userId: number | string): void {
    if (!userId && userId !== 0) {
      this.selected_user_projects = [];
      return;
    }

    if (this.current_user_projects_request) {
      this.current_user_projects_request.unsubscribe();
    }

    this.selected_user_projects = [];

    this.current_user_projects_request = this.userAPI.getUserProjects(userId.toString()).subscribe({
      next: (projects) => {
        this.selected_user_projects = projects || [];
      },
      error: () => {
        this.selected_user_projects = [];
      },
    });
  }
}
