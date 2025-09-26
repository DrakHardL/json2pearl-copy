import { ɵɵtextInterpolate1 } from "@angular/core";
import { DataSet, Edge, IdType, Network, Node, Options } from "vis-network/standalone";


interface NodeCapsule extends Node {
  data?: any,
}

interface EdgeCapsule extends Edge {
  data?: any,
}

/**
 * Empacsulation de la librairie Vis-Network [WIP]
 */
export class GraphCapsule {

  private readonly _config: Options = {
    nodes: {
      font: { color: '#333', size: 16 },
      borderWidth: 2,
    },
    edges: {
      font: { align: 'middle' },
      arrows: { to: { enabled: true, scaleFactor: 0.7 } },
      color: { color: '#888', highlight: '#000' },
    },
    physics: {
      enabled: true,
      stabilization: { iterations: 100 },
    },
    interaction: {
      hover: true,
      dragNodes: true,
      zoomView: true,
      multiselect: true,
    },
  }

  private readonly _network;

  private readonly dataSet_nodes = new DataSet<NodeCapsule>();
  private readonly dataSet_edges = new DataSet<EdgeCapsule>();

  constructor(
    container: HTMLElement
  ) {
    this._network = new Network(
      container,
      { nodes: this.dataSet_nodes, edges: this.dataSet_edges },
      this._config
    );
  }

  addNode(node: NodeCapsule): void {

    try {
      this.dataSet_nodes.add(node);
    } catch(e) {
      console.error(e);
    }
  }
  addEdge(edge: EdgeCapsule): void {
    let is_edge_unique = true;

    this._network.getConnectedEdges(edge.from!).forEach(id => {
      let e = this.dataSet_edges.get(id);
      if (e && e.to == edge.to) is_edge_unique = false;
    })

    if (is_edge_unique) this.dataSet_edges.add(edge);
  }

  removeNode(node: NodeCapsule): void {
    if (node.id) this.dataSet_nodes.remove(node.id);
  }
  removeEdge(edge: EdgeCapsule): void {
    if (edge.id) this.dataSet_edges.remove(edge.id);
  }

  getNodeByID(id: number): NodeCapsule | null {
    return this.dataSet_nodes.get(id)
  }
  getEdgeByID(id: number): EdgeCapsule | null {
    return this.dataSet_edges.get(id)
  }

  editNode(id: number, data: any): void {
    let node = this.dataSet_nodes.get(id);
    if (node) node.data = data;
  }
  editEdge(id: number, data: any): void {
    let edge = this.dataSet_edges.get(id);
    if (edge) edge.data = data;
  }

  clear(): void {
    this.dataSet_edges.clear()
    this.dataSet_nodes.clear()
  }

  getNodes(): NodeCapsule[] {
    let rep: NodeCapsule[] = [];
    this.dataSet_nodes.distinct("id").forEach(r => {
      let node = this.getNodeByID(r as number);
      if (node) rep.push(node)
    });
    return rep;
  }
  getEdegsIDs() {
    throw new Error('Method not implemented.');
  }
}
