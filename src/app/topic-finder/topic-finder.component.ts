import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GraphForge, NodeShape, TopicApiService } from 'ngx-forge-map';
import { Subscription } from 'rxjs';

export interface Topic {
  id: number;
  name: string;
  title: string;
  description: string | null;
  total_projects_count: number;
  organization_id: number;
  avatar_url: string | null;
}

enum NodeColor {
  PROJECT = '#E0AC54',
  USER = '#78B1DD',
  GROUP = '#55D764',
}

enum NodeType {
  PROJECT,
  USER,
  GROUP,
  SUBJECT,
}

@Component({
  selector: 'app-topic-finder',
  imports: [],
  templateUrl: './topic-finder.component.html',
  styleUrl: './topic-finder.component.scss',
})
export class TopicFinder {
  @ViewChild('repartitionChart', { static: true }) repartitionChart!: ElementRef;
  protected repartition!: GraphForge;

  constructor(private readonly topicAPI: TopicApiService, private readonly router: Router) {}

  protected topics: Topic[] = [];
  protected selected_topic: any;

  ngOnInit() {
    this.repartition = new GraphForge(this.repartitionChart.nativeElement);
    this.repartition.onNodeSelect().subscribe((id) => {
      this.onNodeSelected(this.repartition.getNodeID(id));
    });

    this.repartition.onNodeDoubleClick().subscribe((rep) => {
      const topic_id: number = this.repartition.getNodeID(rep);
      const topic: Topic | undefined = this.getTopicByID(topic_id);

      if (topic) {
        this.router.navigate(['/projects'], { queryParams: { topic: topic.name } });
      }
    });
  }

  protected showAllTopics() {
    this.topicAPI.getTopics().subscribe((topics) => {
      this.fill(topics);
    });
  }

  private fill(topics: Topic[]) {
    topics.forEach((topic) => {
      this.repartition.createNode(
        topic.name,
        NodeType.SUBJECT,
        NodeShape.HEXAGON,
        NodeColor.GROUP,
        topic,
        topic.total_projects_count
      );

      console.log(topic);

      this.topics.push(topic);
    });
    this.topics.sort((a: any, b: any) => b.total_projects_count - a.total_projects_count);
  }

  private current_search_request: Subscription | undefined;
  protected async onSearch(query: string) {
    if (this.current_search_request) {
      this.current_search_request.unsubscribe();
    }
    if (query.length >= 1) {
      this.topics = [];
      this.repartition.clear();
      this.current_search_request = await this.topicAPI
        .getTopicsMatchSearch(query)
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

  private onNodeSelected(id: number) {
    const topic = this.getTopicByID(id);
    if (topic) {
      this.selected_topic = topic;
    }
  }

  protected subjectSelected(topic: Topic) {
    this.selected_topic = topic;
    this.repartition.selectNode(this.repartition.generateID(NodeType.SUBJECT, topic.id.toString()));
  }
}
