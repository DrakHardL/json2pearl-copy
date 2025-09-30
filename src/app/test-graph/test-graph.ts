import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { ForgeGraph, GroupApiService, ProjectApiService } from 'ngx-forge-map';


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
        this.network.addNode({ id: p.id, label: `${p.name}`, shape: 'square', color: { background: '#E0AC54', border: '#000000ff' } })
      })
      this.onShowUser();
    })
  }

  onShowUser() {
    this.network.getNodes().forEach(n => {
      this.projectsAPI.getProjectUsers(n.id! as number).subscribe(users => {
        users.forEach(user => {
          this.network.addNode({ id: user.id, label: `${user.name}`, shape: 'circle', color: { background: '#78B1DD', border: '#000000ff' } })
          this.network.addEdge({ from: n.id!, to: user.id, label: '', arrows: 'to' })
        })
      })
      this.projectsAPI.getProjectGroups(n.id! as number).subscribe(groups => {
        groups.forEach(group => {
          this.network.addNode({ id: group.id, label: `${group.name}`, shape: 'triangle', color: { background: '#55D764', border: '#000000ff' } })
          this.network.addEdge({ from: n.id!, to: group.id, label: '', arrows: 'to' })
        })
      })
    });
  }

}
