import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { finalize, Subscription } from 'rxjs';
import {
  GraphForge,
  Group,
  GroupApiService,
  NodeType,
  Project,
  ProjectApiService,
  User,
  UserApiService,
} from 'ngx-forge-map';

import { UtilisateurInformation } from './informations/utilisateur-information/utilisateur-informations.component';
import { ProjectsInformations } from './informations/projects-informations/projects-informations';
import { GroupInformations } from './informations/group-informations/group-informations';
import { FloatingToolbar } from './floating-toolbar/floating-toolbar.component';
import { LoadingSpiner } from '../../models/loading-spiner/loading-spiner';
import { ToolBarItem as ToolbarItem } from '../../models/toolbar-item';
import { UrlManager } from '../../services/url-manager/url-manager';

@Component({
  selector: 'app-projects-page',
  imports: [
    FloatingToolbar,
    GroupInformations,
    UtilisateurInformation,
    MarkdownModule,
    ProjectsInformations,
    LoadingSpiner,
  ],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss',
})
export class ProjectsComponent implements OnInit {
  protected display_informations_panel: boolean = false;

  @ViewChild('projectsChart', { static: true })
  protected projects_chart!: ElementRef;
  protected projects_graph!: GraphForge;
  protected isLoading: boolean = false;

  protected selected_user_projects: any[] = [];
  protected selected_group_members: any[] = [];
  protected selected_elements: any;

  protected elements: {
    projects: any[];
    users: any[];
    groups: any[];
  } = { projects: [], users: [], groups: [] };

  private restriction_topics: string | undefined;

  private current_user_projects_request: Subscription | undefined;
  private current_group_members_request: Subscription | undefined;
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
              this.connectNodes(id_1, id_2);
            }
          });
        });
        this.projectAPI.getProjectGroups(id as unknown as number).subscribe((groups) => {
          groups.forEach((group) => {
            if (ids_groups.indexOf(group.id) != -1) {
              const id_2 = this.createGroup(group);
              this.projects_graph.connectNodes(id_1, id_2);
            }
          });
        });
      });
    });
  }

  private connectNodes(id_1: string, id_2: string) {
    this.projects_graph.connectNodes(id_1, id_2);
  }

  private createGroup(group: any) {
    const obj = { ...group, type: 'group' };
    if (!this._elementsAlreadyCreate(group, 'groups')) this.elements.groups.push(obj);
    return this.projects_graph.createGroup({ ...group, type: 'group' });
  }

  private createUser(user: any) {
    const obj = { ...user, type: 'user' };
    if (!this._elementsAlreadyCreate(user, 'users')) this.elements.users.push(obj);
    return this.projects_graph.createUser({ ...user, type: 'user' });
  }

  private createProject(project: any) {
    const obj = { ...project, type: 'project' };
    if (!this._elementsAlreadyCreate(project, 'projects')) this.elements.projects.push(obj);
    return this.projects_graph.createProject(obj);
  }

  // ========== TOOLBAR-ACTION HANDLE ========== //

  protected onToolbarItemClicked(event: ToolbarItem): void {
    switch (event) {
      case ToolbarItem.EXPEND:
        return this.onExpendToolClicked();
      case ToolbarItem.HIDE:
        return this.onHideToolClicked();
      case ToolbarItem.INFO:
        return this.onInfoToolClicked();
      case ToolbarItem.COPY:
        return this.onCopyToolClicked();
      case ToolbarItem.DOC:
        return this.openDocumentation();
    }
  }

  private openDocumentation(url: string = 'https://google.com'): void {
    if (!url) return;
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (win) win.focus();
  }

  private onInfoToolClicked(): void {
    this.display_informations_panel = !this.display_informations_panel;
  }

  private onExpendToolClicked(): void {
    this.projects_graph.getSelectedNodes().forEach((node_id) => {
      this.onDoubleClick(node_id);
    });
  }

  private onCopyToolClicked(): void {
    const ids_projects = this.projects_graph.getNodesIDByType(NodeType.PROJECT);
    const ids_users = this.projects_graph.getNodesIDByType(NodeType.USER);
    const ids_groups = this.projects_graph.getNodesIDByType(NodeType.GROUP);

    const url = this.urlManager.getEncodedUrl([
      { key: 'projects', value: ids_projects },
      { key: 'users', value: ids_users },
      { key: 'groups', value: ids_groups },
    ]);

    navigator.clipboard
      .writeText(url)
      .then(() => {
        console.log('URL copiée dans le presse-papier :', url);
      })
      .catch((err) => {
        console.error('Erreur lors de la copie :', err);
      });

      (() => {
        const msg = 'URL copiée dans le presse‑papier';
        const id = 'clipboard-toast';
        if (document.getElementById(id)) return;
        const toast = document.createElement('div');
        toast.id = id;
        toast.textContent = msg;
        Object.assign(toast.style, {
          position: 'fixed',
          top: '24px',
          right: '0',
          background: 'rgba(0,0,0,0.85)',
          color: '#fff',
          padding: '10px 16px',
          borderRadius: '6px',
          zIndex: '100000',
          fontSize: '13px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
          opacity: '0',
          transition: 'opacity 200ms ease, transform 200ms ease',
          pointerEvents: 'auto',
        });
        document.body.appendChild(toast);
        // show
        requestAnimationFrame(() => {
          toast.style.opacity = '1';
          toast.style.transform = 'translateX(-50%) translateY(0)';
        });
        // hide after 3s
        setTimeout(() => {
          toast.style.opacity = '0';
          toast.style.transform = 'translateX(-50%) translateY(8px)';
          toast.addEventListener(
            'transitionend',
            () => {
              toast.remove();
            },
            { once: true }
          );
        }, 1000);
      })();

    console.log(url);
  }

  private onHideToolClicked(): void {
    this.projects_graph.getSelectedNodes().forEach((node_id) => {
      const data: any = this.projects_graph.getNodeDataByID(node_id);

      switch (data.type) {
        case 'project':
          return this.elements.projects.forEach((project) => {
            if (project.id == data.id) {
              this.elements.projects.splice(this.elements.projects.indexOf(project), 1);
              this.projects_graph.removeNode(node_id);
            }
          });

        case 'user':
          return this.elements.users.forEach((user) => {
            if (user.id == data.id) {
              this.elements.users.splice(this.elements.users.indexOf(user), 1);
              this.projects_graph.removeNode(node_id);
            }
          });

        case 'group':
          return this.elements.groups.forEach((group) => {
            if (group.id == data.id) {
              this.elements.groups.splice(this.elements.groups.indexOf(group), 1);
              this.projects_graph.removeNode(node_id);
            }
          });

        default:
          console.warn('WTF ????');
      }
    });
  }

  protected onItemSelected(item: any): void {
    this.selected_elements = item;
  }

  private current_search_request: Subscription | undefined;
  protected async onSearch(query: string) {
    if (query.length == 0 || this.restriction_topics) {
      return this.showAllProjectMatchTopic();
    }
    if (this.current_search_request) {
      this.current_search_request.unsubscribe();
    }
    this.elements.projects = [];
    this.elements.groups = [];
    this.elements.users = [];

    this.projects_graph.clear();
    this.isLoading = true;
    this.current_search_request = await this.projectAPI
      .getProjectsMatchSearch(query)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((projects) => {
        projects.forEach((project) => {
          this.createProject(project);
        });
      });
  }

  private showAllProjectMatchTopic() {
    if (!this.restriction_topics) return;

    this.projectAPI.getProjectsMatchTopic(this.restriction_topics).subscribe((projects) => {
      projects.forEach((project) => {
        this.createProject(project);
      });
    });
  }

  private onSimpleClick(id: string): void {
    const node_type = this.projects_graph.getNodeType(id);
    this.selected_user_projects = [];
    this.selected_group_members = [];

    if (node_type == NodeType.PROJECT) {
      this.selected_elements = this.projects_graph.getNodeDataByID(id);
      return;
    }

    if (node_type == NodeType.GROUP) {
      this.selected_elements = this.projects_graph.getNodeDataByID(id);
      this.loadGroupMembers(this.projects_graph.getNodeID(id));
      return;
    }

    if (node_type == NodeType.USER) {
      this.selected_elements = this.projects_graph.getNodeDataByID(id);
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
          this.connectNodes(id_1, id_2);
        });
      });

      return this.projectAPI.getProjectGroups(node_id).subscribe((groups) => {
        groups.forEach((group) => {
          const id_2 = this.createGroup(group);
          this.connectNodes(id_1, id_2);
        });
      });
    }

    if (node_type == NodeType.USER) {
      return this.userAPI.getUserProjects(node_id.toString()).subscribe((projects) => {
        projects.forEach((project) => {
          const id_2 = this.createProject(project);
          this.connectNodes(id_1, id_2);
        });
      });
    }

    if (node_type == NodeType.GROUP) {
      return this.groupAPI.getGroupProjects(node_id).subscribe((projects) => {
        projects.forEach((project) => {
          const id_2 = this.createProject(project);
          this.connectNodes(id_1, id_2);
        });
      });
    }
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

  private _elementsAlreadyCreate(element: any, type: 'projects' | 'users' | 'groups'): boolean {
    let liste: any[] = [];

    switch (type) {
      case 'projects':
        liste = this.elements.projects;
        break;
      case 'groups':
        liste = this.elements.groups;
        break;
      case 'users':
        liste = this.elements.users;
        break;
    }

    for (let index = 0; index < liste.length; index++) {
      const elt = liste[index];

      if (element.id == elt.id) {
        return true;
      }
    }

    return false;
  }

  private loadGroupMembers(groupId: number | string): void {
    if (!groupId && groupId !== 0) {
      this.selected_group_members = [];
      return;
    }

    if (this.current_group_members_request) {
      this.current_group_members_request.unsubscribe();
    }

    this.selected_group_members = [];

    this.current_group_members_request = this.groupAPI
      .getGroupMembers(groupId as number)
      .subscribe({
        next: (resp) => {
          this.selected_group_members = resp?.members || [];
        },
        error: () => {
          this.selected_group_members = [];
        },
      });
  }

  @HostListener('document:keydown', ['$event'])
  protected onDeleteInput(event: KeyboardEvent): void {
    if (event.key === 'Delete') this.onHideToolClicked();
  }
}
