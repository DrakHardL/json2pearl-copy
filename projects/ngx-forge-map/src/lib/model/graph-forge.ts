import { EventEmitter } from '@angular/core';
import { DataSet, Edge, network, Network, Node, Options } from 'vis-network/standalone';
import { Project } from './project.model';
import { Topic } from './topic.model';
import { Group } from './group.model';
import { User } from './user.model';

interface NodeGraph extends Node {
  data?: {
    id: string;
  };
  type?: string | number;
}

interface EdgeGraph extends Edge {
  data?: any;
}

export enum NodeShape {
  SQUARE = 'square',
  IMAGE = 'image',
  CIRCULAR_IMAGE = 'circularImage',
  DIAMOND = 'diamond',
  DOT = 'dot',
  STAR = 'star',
  TRIANGLE = 'triangle',
  TRIANGLE_DOWN = 'triangleDown',
  HEXAGON = 'hexagon',
  ICON = 'icon',
}

export enum NodeType {
  PROJECT,
  USER,
  GROUP,
  SUBJECT,
}

enum NodeColor {
  PROJECT = '#E0AC54',
  USER = '#78B1DD',
  GROUP = '#55D764',
}

export enum EdgeType {
  FROM,
  TO,
  NONE,
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
  };

  private readonly _network;

  private readonly resisted_edges = new Map<string, string>();
  private readonly dataSet_nodes = new DataSet<NodeGraph>();
  private readonly dataSet_edges = new DataSet<EdgeGraph>();
  private readonly ref_nodes = new Map<NodeShape, Map<number, string>>();
  private readonly reverse_ref_node = new Map<string, { type: NodeShape; id: number }>();

  constructor(container: HTMLElement) {
    this._network = new Network(
      container,
      { nodes: this.dataSet_nodes, edges: this.dataSet_edges },
      this._config
    );
  }

  setRepultion(distance: number): void {
    this._network.setOptions({
      physics: {
        solver: 'repulsion',
        repulsion: {
          nodeDistance: distance,
        },
      },
    });
  }

  createNode(
    label: string,
    type: number,
    shape: NodeShape,
    color: string,
    data?: any,
    size: number = 0
  ): string {
    const node: NodeGraph = {
      id: this.generateID(type, data.id),
      label: label,
      type: type,
      shape: shape,
      color: {
        background: color,
        border: '#000000',
      },
      data: data,
      size: 50 + size * 2,
    };
    if (this.dataSet_nodes.getIds().includes(node.id!)) {
      return node.id as string;
    }

    const id = this.dataSet_nodes.add(node)[0];
    return id as string;
  }

  generateID(type: number, id: string): string {
    return `==${type}==${id}==`;
  }

  connectNodes(id_1: string, id_2: string, type: EdgeType = EdgeType.NONE): void {
    if (
      this.resisted_edges.has(`||${id_1}||${id_2}||`) ||
      this.resisted_edges.has(`||${id_2}||${id_1}||`)
    )
      return;
    const id = this.dataSet_edges.add({
      to: id_1,
      from: id_2,
      arrows: {
        from: type === EdgeType.FROM || false,
        to: type === EdgeType.TO || false,
      },
    })[0] as string;

    this.resisted_edges.set(`||${id_1}||${id_2}||`, id);
    this.resisted_edges.set(`||${id_2}||${id_1}||`, id);
  }

  clear(): void {
    this.dataSet_edges.clear();
    this.dataSet_nodes.clear();
    this.ref_nodes.clear();
    this.reverse_ref_node.clear();
  }

  getSelectedNodes(): string[] {
    return this._network.getSelectedNodes() as string[];
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

  onNodeDoubleClick(): EventEmitter<string> {
    const event = new EventEmitter<string>();
    const temp = new EventEmitter<string>();
    temp.subscribe((id) => {
      event.emit(id);
    });
    this._network.on('doubleClick', (e) => {
      temp.emit(e.nodes[0]);
    });

    return event;
  }

  onNodeSelect(): EventEmitter<string> {
    const event = new EventEmitter<string>();
    const temp = new EventEmitter<string>();
    temp.subscribe((id) => {
      event.emit(id);
    });
    this._network.on('selectNode', (e) => {
      temp.emit(e.nodes[0]);
    });

    return event;
  }

  removeNode(id: string): void {
    this.dataSet_nodes.remove(id);
  }

  getNodeDataByID(id: string): any {
    return (this.dataSet_nodes.get(id) as NodeGraph).data;
  }

  selectNode(id: string): void {
    this._network.selectNodes([id]);
  }

  getNodesIDByType(type: number): number[] {
    let nodes: NodeGraph[] = this.dataSet_nodes.get();

    nodes = nodes.filter((n) => (n.id?.toString().split('==')[1] as unknown as number) == type);

    return nodes.map((n) => n.id!.toString().split('==')[2] as unknown as number);
  }

  fit(): void {
    this._network.fit({
      animation: {
        duration: 2000,
        easingFunction: 'easeOutCubic',
      },
    });
  }

  focus(id: string): void {
    this._network.focus(id);
  }

  // ========== UPDATE ========== //

  public createProject(project: Project, size?: number): string {
    return this.createNode(
      project.name,
      NodeType.PROJECT,
      NodeShape.SQUARE,
      NodeColor.PROJECT,
      project,
      size
    );
  }

  public createTopic(topic: Topic, size?: number): string {
    return this.createNode(
      topic.name,
      NodeType.SUBJECT,
      NodeShape.HEXAGON,
      NodeColor.GROUP,
      topic,
      size
    );
  }

  public createGroup(group: Group, size?: number): string {
    return this.createNode(
      group.name,
      NodeType.GROUP,
      NodeShape.TRIANGLE,
      NodeColor.GROUP,
      group,
      size
    );
  }

  public createUser(user: User, size?: number): string {
    return this.createNode(user.name, NodeType.USER, NodeShape.DOT, NodeColor.USER, user, size);
  }
}
