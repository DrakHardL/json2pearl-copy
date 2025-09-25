import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GraphCapsule } from '../emcapsulation/graph-capsule';

@Component({
  selector: 'app-test-graph',
  imports: [],
  templateUrl: './test-graph.html',
  styleUrl: './test-graph.scss'
})
export class TestGraph implements OnInit {
  @ViewChild('visNetwork', { static: true }) visNetwork!: ElementRef;

  network!: GraphCapsule;

  ngOnInit() {
    this.network = new GraphCapsule(this.visNetwork.nativeElement);
    for (let i = 0; i < 10; i++) {
      this.network.addNode({ id: i, label: `${i}`, shape: 'circle', color: { background: '#3b819cff', border: '#0288D1' } });
    }
    for (let k = 0; k < 20; k++) {
      const from = Math.floor(Math.random() * 10);
      const to = Math.floor(Math.random() * 10);
      if (from !== to) {
        this.network.addEdge({ from, to, label: '', arrows: 'to' });
      }
    }
  }

}
