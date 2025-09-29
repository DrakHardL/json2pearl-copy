import { DataSet, Edge, Network, Node, Options } from "vis-network/standalone";


interface NodeGraph extends Node {
  data?: any,
}

interface EdgeGraph extends Edge {
  data?: any,
}

/**
 * Empacsulation de la librairie Vis-Network [WIP]
 */
export class ForgeGraph {

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

  private readonly dataSet_nodes = new DataSet<NodeGraph>();
  private readonly dataSet_edges = new DataSet<EdgeGraph>();

  constructor(
    container: HTMLElement
  ) {
    this._network = new Network(
      container,
      { nodes: this.dataSet_nodes, edges: this.dataSet_edges },
      this._config
    );
  }

  addNode(node: NodeGraph): void {

    try {
      this.dataSet_nodes.add(node);
    } catch (e) {
      console.error(e);
    }
  }
  addEdge(edge: EdgeGraph): void {
    let is_edge_unique = true;

    this._network.getConnectedEdges(edge.from!).forEach(id => {
      let e = this.dataSet_edges.get(id);
      if (e && e.to == edge.to) is_edge_unique = false;
    })

    if (is_edge_unique) this.dataSet_edges.add(edge);
  }

  removeNode(node: NodeGraph): void {
    if (node.id) this.dataSet_nodes.remove(node.id);
  }
  removeEdge(edge: EdgeGraph): void {
    if (edge.id) this.dataSet_edges.remove(edge.id);
  }

  getNodeByID(id: number): NodeGraph | null {
    return this.dataSet_nodes.get(id)
  }
  getEdgeByID(id: number): EdgeGraph | null {
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

  getNodes(): NodeGraph[] {
    let rep: NodeGraph[] = [];
    this.dataSet_nodes.distinct("id").forEach(r => {
      let node = this.getNodeByID(r as number);
      if (node) rep.push(node)
    });
    return rep;
  }
  getEdegsIDs() {
    throw new Error('WIP Method not implemented.');
  }
}
