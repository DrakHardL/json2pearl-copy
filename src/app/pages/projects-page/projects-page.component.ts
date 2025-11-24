import { UtilisateurInformation } from './informations/utilisateur-information/utilisateur-informations.component';
import { ProjectsInformations } from './informations/projects-informations/projects-informations';
import { GroupInformations } from './informations/group-informations/group-informations';
import { FloatingToolbar } from './floating-toolbar/floating-toolbar.component';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { expand, finalize, map, Observable, Subscription } from 'rxjs';
import { UrlManager } from '../../services/url-manager/url-manager';
import { ToolBarItem as ToolbarItem } from '../../data/toolbar-item';
import { ActivatedRoute } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import {
  GraphForge,
  GroupApiService,
  NodeType,
  ProjectApiService,
  UserApiService,
} from 'ngx-forge-map';

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
  @ViewChild('projectsChart', { static: true })
  protected projects_chart!: ElementRef;
  protected projects_graph!: GraphForge;
  protected isLoading: boolean = false;
  protected selected_elements: any;
  protected elements: any[] = [];

  private restriction_topics: string | undefined;

  constructor(
    private readonly projectAPI: ProjectApiService,
    private readonly groupAPI: GroupApiService,
    private readonly userAPI: UserApiService,
    private readonly urlManager: UrlManager,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.projects_graph = new GraphForge(this.projects_chart.nativeElement);

    this.projects_graph.onNodeDoubleClick().subscribe((id) => this.onDoubleClick(id));
    this.projects_graph.onNodeSelect().subscribe((id) => this.onSimpleClick(id));

    if (history.state.data) {
      return this.load_state();
    }

    const snapshotParams = this.route.snapshot.queryParamMap;
    if (snapshotParams.has('topics')) {
      this.restriction_topics = snapshotParams.get('topics')!;
      this.showAllProjectMatchTopic();
    }
  }

  private load_state(): void {
    let ids_projects: number[] = history.state.data.projects || [];
    let ids_users: number[] = history.state.data.users || [];
    let ids_groups: number[] = history.state.data.groups || [];

    ids_projects.forEach((id) => {
      this.projectAPI.getProject(id as unknown as number).subscribe((project) => {
        const id_1 = this.createProject(project);

        this.projectAPI.getProjectUsers(id as unknown as number).subscribe((users) => {
          users.forEach((user) => {
            if (ids_users.indexOf(user.id) != -1) {
              const id_2 = this.createUser(user);
              this.connect_2_nodes(id_1, id_2);
            }
          });
        });
        this.projectAPI.getProjectGroups(id as unknown as number).subscribe((groups) => {
          groups.forEach((group) => {
            if (ids_groups.indexOf(group.id) != -1) {
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

    const url = this.urlManager.getEncodedUrl([
      { key: 'projects', value: ids_projects },
      { key: 'users', value: ids_users },
      { key: 'groups', value: ids_groups },
    ]);

    console.log(url);
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
    if (query.length == 0 || this.restriction_topics) {
      return this.showAllProjectMatchTopic();
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

  private showAllProjectMatchTopic() {
    if (!this.restriction_topics) return;

    this.projectAPI.getProjectsMatchTopic(this.restriction_topics).subscribe((projects) => {
      this.fill(projects);
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

  private createUser(user: any): string {
    return this.projects_graph.createUser(user);
  }

  private connect2nodes(id_1: string, id_2: string): void {
    return this.projects_graph.connectNodes(id_1, id_2);
  }

  private createProject(project: any): string {
    return this.projects_graph.createProject(project);
  }

  private createGroup(group: any): string {
    return this.projects_graph.createGroup(group);
  }
}
