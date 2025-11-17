import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as LZString from 'lz-string';

import {
  GraphForge,
  GroupApiService,
  NodeShape,
  ProjectApiService,
  TopicApiService,
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
  selector: 'app-test-graph',
  imports: [],
  templateUrl: './test-graph.html',
  styleUrl: './test-graph.scss',
})
export class TestGraph implements OnInit {
  @ViewChild('visNetwork', { static: true }) visNetwork!: ElementRef;

  network!: GraphForge;

  constructor(
    private readonly projectsAPI: ProjectApiService,
    private readonly groupAPI: GroupApiService,
    private readonly userAPI: UserApiService,
    private readonly topicAPI: TopicApiService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.network = new GraphForge(this.visNetwork.nativeElement);

    this.network.onNodeDoubleClick().subscribe((id) => this.on2click(id));
    this.network.onNodeSelect().subscribe((id) => {});
  }

  onSearch(_t3: HTMLInputElement) {
    this.projectsAPI.searchProjects(_t3.value).subscribe((projects) => {
      this.network.clear();
      projects.forEach((project) => {
        this.createProject(project);
      });
    });
  }

  on2click(id: string) {
    this.extends(id);
  }

  private extends(id: string) {
    const type: NodeType = this.network.getNodeType(id);
    const elt_id = this.network.getNodeID(id);

    if (type == NodeType.PROJECT) {
      this.projectsAPI.getProjectUsers(elt_id as unknown as number).subscribe((users) => {
        users.forEach((user) => {
          this.connectNodes(this.createUser(user), id);
        });
      });
      this.projectsAPI.getProjectGroups(elt_id as unknown as number).subscribe((groups) => {
        groups.forEach((group) => {
          this.connectNodes(this.createGroup(group), id);
        });
      });
    } else if (type == NodeType.USER) {
      this.userAPI.getUserProjects(elt_id as unknown as string).subscribe((projects) => {
        projects.forEach((project) => {
          this.connectNodes(this.createProject(project), id);
        });
      });
    } else if (type == NodeType.GROUP) {
      this.groupAPI.getGroupProjects(elt_id as unknown as number).subscribe((projects) => {
        projects.forEach((project) => {
          this.connectNodes(this.createProject(project), id);
        });
      });
    } else {
      throw new Error('nouveau type non declarer');
    }
  }

  onExpend() {
    this.network.getSelectedNodes().forEach((id) => {
      this.extends(id);
    });
  }

  private connectNodes(id_node_1: string, id_node_2: string) {
    return this.network.connectNodes(id_node_1, id_node_2);
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

  createUser(user: any): string {
    return this.createNode(user.name, NodeType.USER, NodeShape.DOT, NodeColor.USER, user);
  }

  createProject(project: any): string {
    return this.createNode(
      project.name,
      NodeType.PROJECT,
      NodeShape.SQUARE,
      NodeColor.PROJECT,
      project
    );
  }

  createGroup(group: any): string {
    return this.createNode(group.name, NodeType.GROUP, NodeShape.TRIANGLE, NodeColor.GROUP, group);
  }

  private delete_selected_element(): void {
    this.network.getSelectedNodes().forEach((node) => {
      this.network.removeNode(node);
    });
  }

  onSave(): void {
    const ids_projects = this.network.getNodesIDByType(NodeType.PROJECT);
    const ids_users = this.network.getNodesIDByType(NodeType.USER);
    const ids_groups = this.network.getNodesIDByType(NodeType.GROUP);

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

  @HostListener('document:keydown', ['$event'])
  on_input(event: KeyboardEvent) {
    if (event.key == 'Delete') {
      this.delete_selected_element();
    }
  }
}
