import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { ForgeGraph, GroupApiService, NodeShape, ProjectApiService } from 'ngx-forge-map';


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
  ) { }

  ngOnInit() {
    this.network = new ForgeGraph(this.visNetwork.nativeElement);
  }

  onSearch(_t3: HTMLInputElement) {
    this.projectsAPI.searchProjects(_t3.value).subscribe(projects => {
      this.network.clear()
      projects.forEach(p => {
        this.network.addNode(p.name, NodeShape.SQUARE, { background: "#E0AC54" }, p)
      })
      this.onShowUser();
    })
  }

  onShowUser() {
    this.network.getNodes().forEach(n => {
      this.projectsAPI.getProjectUsers(n.data!.id! as number).subscribe(users => {
        users.forEach(user => {
          this.network.addNode(user.name, NodeShape.DOT, { background: "#78B1DD" }, user)
          this.network.addEdge({ id: n.data.id, type: NodeShape.SQUARE }, { id: user.id, type: NodeShape.DOT })
        })
      })
      this.projectsAPI.getProjectGroups(n.data.id! as number).subscribe(groups => {
        groups.forEach(group => {
          this.network.addNode(group.name, NodeShape.TRIANGLE, { background: "#55D764" }, group);
          this.network.addEdge({ id: n.data.id, type: NodeShape.SQUARE }, { id: group.id, type: NodeShape.TRIANGLE })
        })
      })
    });
  }

}
