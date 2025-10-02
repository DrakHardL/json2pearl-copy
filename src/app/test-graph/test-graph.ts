import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { GraphForge, GroupApiService, NodeShape, ProjectApiService, UserApiService } from 'ngx-forge-map';

enum NodeColor {
  PROJECT = "#E0AC54",
  USER = "#78B1DD",
  GROUP = "#55D764"
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
  styleUrl: './test-graph.scss'
})
export class TestGraph implements OnInit {

  @ViewChild('visNetwork', { static: true }) visNetwork!: ElementRef;

  network!: GraphForge;

  constructor(
    private readonly projectsAPI: ProjectApiService,
    private readonly groupAPI: GroupApiService,
    private readonly userAPI: UserApiService,
  ) { }

  ngOnInit() {
    this.network = new GraphForge(this.visNetwork.nativeElement);

    this.network.onNodeDoubleClick().subscribe(id => this.on2click(id));
  }

  onSearch(_t3: HTMLInputElement) {
    this.projectsAPI.searchProjects(_t3.value).subscribe(projects => {
      this.network.clear()
      projects.forEach(project => { this.createProject(project) });
    })
  }

  on2click(id: string) {
    this.extends(id);
    
  }

  private extends(id: string) {
    const type: NodeType = this.network.getNodeType(id);
    const elt_id = this.network.getNodeID(id);

    console.log("type du noued :", type, type == NodeType.PROJECT);
    console.log("identifiant du noued :", elt_id);

    if (type == NodeType.PROJECT) {
      this.projectsAPI.getProjectUsers(elt_id as unknown as number).subscribe(users => {
        users.forEach(user => {
          this.connectNodes(this.createUser(user), id);
        });
      });
      this.projectsAPI.getProjectGroups(elt_id as unknown as number).subscribe(groups => {
        groups.forEach(group => {
          this.connectNodes(this.createGroup(group), id);
        });
      });
    } else if (type == NodeType.USER) {
      this.userAPI.getUserProjects(elt_id as unknown as string).subscribe(projects => {
        projects.forEach(project => {
          this.connectNodes(this.createProject(project), id)
        });
      });
    } else if (type == NodeType.GROUP) {
      this.groupAPI.getGroupProjects(elt_id as unknown as number).subscribe(projects => {
        projects.forEach(project => {
          this.connectNodes(this.createProject(project), id);
        });
      });
    } else {
      throw new Error("nouveau type non declarer");
    }
  }

  onExpend() {
    this.network.getSelectedNodes().forEach(id => {
      this.extends(id);
    })
  }

  private connectNodes(id_node_1: string, id_node_2: string) {
    return this.network.connectNodes(id_node_1, id_node_2);
  }

  private createNode(label: string, type: number, shape: NodeShape, color: string, data: any): string {
    return this.network.createNode(label, type, shape, color, data);
  }

  createUser(user: any): string {
    console.log("create user");
    return this.createNode(user.name, NodeType.USER, NodeShape.DOT, NodeColor.USER, user);
  }

  createProject(project: any): string {
    return this.createNode(project.name, NodeType.PROJECT, NodeShape.SQUARE, NodeColor.PROJECT, project);
  }

  createGroup(group: any): string {
    return this.createNode(group.name, NodeType.GROUP, NodeShape.TRIANGLE, NodeColor.GROUP, group);
  }
}
