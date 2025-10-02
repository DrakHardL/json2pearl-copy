import { DataSet, Edge, Network, Node, Options } from "vis-network/standalone";

interface NodeGraph extends Node {
  data?: {
    id: string,
  },
  type?: string | number,
}

interface EdgeGraph extends Edge {
  data?: any,
}

export enum NodeShape {
  SQUARE = "square",
  IMAGE = "image",
  CIRCULAR_IMAGE = "circularImage",
  DIAMOND = "diamond",
  DOT = "dot",
  STAR = "star",
  TRIANGLE = "triangle",
  TRIANGLE_DOWN = "triangleDown",
  HEXAGON = "hexagon",
  ICON = "icon",
}


export class GraphForge {

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
  private readonly ref_nodes = new Map<NodeShape, Map<number, string>>()
  private readonly reverse_ref_node = new Map<string, { type: NodeShape, id: number }>();

  constructor(
    private readonly container: HTMLElement
  ) {
    this._network = new Network(container, { nodes: this.dataSet_nodes, edges: this.dataSet_edges }, this._config);
  }

  private _registerNewNode(node_type: NodeShape, node_ref_id: number, node_id: string): boolean {
    if (!this.ref_nodes.has(node_type)) {
      this.ref_nodes.set(node_type, new Map());
    }
    let e = this.ref_nodes.get(node_type)!;

    if (e.has(node_ref_id)) return false;
    e.set(node_ref_id, node_id);
    this.reverse_ref_node.set(node_id, { type: node_type, id: node_ref_id });
    return true;
  }

  private _getReverseNodeRef(graph_node_id: string) {
    return this.reverse_ref_node.get(graph_node_id);
  }

  private _getNodeRef(node_type: NodeShape, node_ref_id: number): string | undefined {
    return this.ref_nodes.get(node_type)?.get(node_ref_id);
  }

  /**
   * Creates a new node in the graph with the specified properties.
   *
   * @param label - The display label for the node.
   * @param type - The type identifier for the node.
   * @param shape - The shape of the node, as defined by `NodeShape`.
   * @param color - The background color of the node (CSS color string).
   * @param data - Optional additional data to associate with the node.
   *
   * @remarks
   * - The node ID is generated based on the type and the `data.id` property.
   * - If a node with the same ID already exists, the method will log a warning and not create a duplicate.
   * - The new node is added to the internal node dataset and can be referenced by its generated ID.
   */
  createNode(
    label: string,
    type: number,
    shape: NodeShape,
    color: string,
    data?: any
  ): string {
    const node: NodeGraph = {
      id: this.generateID(type, data.id),
      label: label,
      type: type,
      shape: shape,
      color: {
        background: color,
        border: "#000000",
      },
      data: data
    };
    if (this.dataSet_nodes.getIds().includes(node.id!)) {
      return node.id as string;
    }

    const id = this.dataSet_nodes.add(node)[0];
    console.log("Un noeud avec l'identifiant :", id);
    return id as string;
  }

  generateID(type: number, id: string): string {
    return `==${type}==${id}==`
  }

  connectNodes(id_1: string, id_2: string) {
    this.dataSet_edges.add({ id: `||${id_1}||${id_2}||`, to: id_1, from: id_2 });
  }

  clear(): void {
    this.dataSet_edges.clear();
    this.dataSet_nodes.clear();
    this.ref_nodes.clear();
    this.reverse_ref_node.clear();
  }

  getSelectedNodes(): string[] {
    return this._network.getSelectedNodes() as string[]
  }

  getNodeType(id: string): number {
    const r = id.split('==').slice(1, 3);
    let type = r[0];

    return type as unknown as number;
  }

  getNodeID(id: string): number {
    const r = id.split('==').slice(1, 3);
    let elt_id = r[1];

    return elt_id as unknown as number;
  }
}
