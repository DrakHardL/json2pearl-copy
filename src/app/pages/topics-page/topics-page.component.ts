import { GraphForge, NodeShape, TopicApiService } from 'ngx-forge-map';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NodeColor } from '../projects-page/data/node-color';
import { NodeType } from '../projects-page/data/node-type';
import { Router, RouterLink } from '@angular/router';
import { finalize, Subscription } from 'rxjs';

export interface Topic {
  id: number;
  name: string;
  title: string;
  description: string | null;
  total_projects_count: number;
  organization_id: number;
  avatar_url: string | null;
}

@Component({
  selector: 'app-topics-page',
  templateUrl: './topics-page.component.html',
  styleUrl: './topics-page.component.scss',
  imports: [RouterLink],
})
export class TopicsComponent {
  @ViewChild('topicsChart', { static: true }) topicsChart!: ElementRef;
  protected topics_graph!: GraphForge;
  protected topics: Topic[] = [];
  protected selected_topic: any;

  constructor(private readonly topicAPI: TopicApiService, private readonly router: Router) {}

  ngOnInit() {
    this.topics_graph = new GraphForge(this.topicsChart.nativeElement);
    this.topics_graph.onNodeSelect().subscribe((id) => {
      this.onNodeSelect(id);
    });

    this.topics_graph.onNodeDoubleClick().subscribe((rep) => {
      const topic_id: number = this.topics_graph.getNodeID(rep);
      const topic: Topic | undefined = this.getTopicByID(topic_id);

      if (topic) {
        this.router.navigate(['/projects'], { queryParams: { topics: topic.name } });
      }
    });

    this.showAllTopics();
  }

  private showAllTopics() {
    this.topicAPI.getTopics().subscribe((topics) => {
      this.fill(topics);
    });
  }

  private fill(topics: Topic[]) {
    topics.forEach((topic) => {
      this.topics_graph.createNode(
        topic.name,
        NodeType.SUBJECT,
        NodeShape.HEXAGON,
        NodeColor.GROUP,
        topic,
        topic.total_projects_count
      );

      this.topics.push(topic);
    });
    this.topics.sort((a: any, b: any) => b.total_projects_count - a.total_projects_count);
  }

  private current_search_request: Subscription | undefined;
  protected async onSearch(query: string) {
    if (query.length == 0) {
      return this.showAllTopics();
    }
    if (this.current_search_request) {
      this.current_search_request.unsubscribe();
    }
    if (query.length >= 1) {
      this.topics = [];
      this.topics_graph.clear();
      this.current_search_request = await this.topicAPI
        .getTopicsMatchSearch(query)
        .pipe(
          finalize(() => {
            this.topics_graph.fit();
          })
        )
        .subscribe((rep) => {
          console.log(rep);
          this.fill(rep);
        });
    }
  }

  private getTopicByID(id: number): Topic | undefined {
    let rep: Topic | undefined = undefined;

    this.topics.forEach((topic) => {
      if (topic.id == id) {
        rep = topic;
      }
    });

    return rep;
  }

  private onNodeSelect(id: string) {
    const true_id = this.topics_graph.getNodeID(id);
    const topic = this.getTopicByID(true_id);
    if (topic) {
      this.selected_topic = topic;
    }
  }

  protected subjectSelected(topic: Topic) {
    this.selected_topic = topic;
    this.topics_graph.selectNode(
      this.topics_graph.generateID(NodeType.SUBJECT, topic.id.toString())
    );
  }

  private on2Click(node_id: string): void {}

  protected test2clickEvent(elt: any): void {
    let t = this.topics_graph.generateID(elt?.type, elt.id);
    console.log(elt, t);
  }
}
