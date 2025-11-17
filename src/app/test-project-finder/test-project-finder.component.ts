import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  GraphForge,
  GroupApiService,
  NodeShape,
  ProjectApiService,
  UserApiService,
} from 'ngx-forge-map';

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

  constructor(
    private readonly projectsAPI: ProjectApiService,
    private readonly groupAPI: GroupApiService,
    private readonly userAPI: UserApiService
  ) {}

  ngOnInit(): void {
    this.network = new GraphForge(this.visNetwork.nativeElement);

    if (history.state.data) {
      return this.load_state();
    }

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
      this.projectsAPI.getProject(id as unknown as number).subscribe((project) => {
        const id_1 = this.createNode(
          project.name,
          NodeType.PROJECT,
          NodeShape.SQUARE,
          NodeColor.PROJECT,
          project
        );

        this.projectsAPI.getProjectUsers(id as unknown as number).subscribe((users) => {
          users.forEach((user) => {
            if (ids_users.indexOf(user.id.toString()) != -1) {
              const id_2 = this.createNode(
                user.name,
                NodeType.USER,
                NodeShape.DOT,
                NodeColor.USER,
                user
              );
              this.connect_2_nodes(id_1, id_2);
            }
          });
        });
        this.projectsAPI.getProjectGroups(id as unknown as number).subscribe((groups) => {
          groups.forEach((group) => {
            if (ids_groups.indexOf(group.id.toString()) != -1) {
              const id_2 = this.createNode(
                group.name,
                NodeType.GROUP,
                NodeShape.TRIANGLE,
                NodeColor.GROUP,
                group
              );
              this.connect_2_nodes(id_1, id_2);
            }
          });
        });
      });
    });
  }

  private connect_2_nodes(id_1: string, id_2: string) {
    return this.network.connectNodes(id_1, id_2);
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
