import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { ForgeGraph, GroupApiService, NodeShape, ProjectApiService, UserApiService } from 'ngx-forge-map';


@Component({
  selector: 'app-test-graph',
  imports: [],
  templateUrl: './test-graph.html',
  styleUrl: './test-graph.scss'
})
export class TestGraph implements OnInit {

  @ViewChild('visNetwork', { static: true }) visNetwork!: ElementRef;

  network!: ForgeGraph;

  constructor(
    private readonly projectsAPI: ProjectApiService,
    private readonly groupAPI: GroupApiService,
    private readonly userAPI: UserApiService,
  ) { }

  ngOnInit() {
    this.network = new ForgeGraph(this.visNetwork.nativeElement);
  }

  onSearch(_t3: HTMLInputElement) {
    this.projectsAPI.searchProjects(_t3.value).subscribe(projects => {
      this.network.clear()
      projects.forEach(project => {
        this.createProject(project)
      })
    })
  }

  onShowUser() {
    this.network.getNodes().forEach(n => {
      this.projectsAPI.getProjectUsers(n.data!.id! as number).subscribe(users => {
        users.forEach(user => {
          this.createUser(user)
          this.network.addEdge({ id: n.data.id, type: NodeShape.SQUARE }, { id: user.id, type: NodeShape.DOT })
        })
      })
      this.projectsAPI.getProjectGroups(n.data.id! as number).subscribe(groups => {
        groups.forEach(group => {
          this.createGroup(group);
          this.network.addEdge({ id: n.data.id, type: NodeShape.SQUARE }, { id: group.id, type: NodeShape.TRIANGLE })
        })
      })
    });
  }

  onExpend() {
    this.network.getSelectedElements().forEach(e => {
      switch (e.type) {
        case NodeShape.DOT:
          this.userAPI.getUserProjects(e.id as unknown as string).subscribe(projects => {
            projects.forEach(project => {
              this.createProject(project);
              this.network.addEdge({ id: project.id, type: NodeShape.SQUARE }, { id: e.id, type: NodeShape.DOT });
            });
          });
          break;
        case NodeShape.SQUARE:
          this.projectsAPI.getProjectUsers(e.id).subscribe(users => {
            users.forEach(user => {
              this.createUser(user);
              this.network.addEdge({ id: user.id, type: NodeShape.DOT }, { id: e.id, type: NodeShape.SQUARE });
            });
          });
          this.projectsAPI.getProjectGroups(e.id).subscribe(groups => {
            groups.forEach(group => {
              this.createGroup(group);
              this.network.addEdge({ id: group.id, type: NodeShape.TRIANGLE }, { id: e.id, type: NodeShape.SQUARE });
            });
          });
          break;
        case NodeShape.TRIANGLE:
          this.groupAPI.getGroupProjects(e.id).subscribe(projects => {
            projects.forEach(project => {
              this.createProject(project);
              this.network.addEdge({ id: project.id, type: NodeShape.SQUARE }, { id: e.id, type: NodeShape.TRIANGLE });
            });
          });
          break;
      }
    })
  }

  createUser(user: any) {
    this.network.addNode(user.name, NodeShape.DOT, { background: "#78B1DD" }, user);
  }

  createProject(project: any) {
    this.network.addNode(project.name, NodeShape.SQUARE, { background: "#E0AC54" }, project)
  }

  createGroup(group: any) {
    this.network.addNode(group.name, NodeShape.TRIANGLE, { background: "#55D764" }, group);
  }
}
