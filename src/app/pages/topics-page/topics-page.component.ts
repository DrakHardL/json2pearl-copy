import { Component, ElementRef, ViewChild } from '@angular/core';
import { GraphForge, NodeType, TopicApiService } from 'ngx-forge-map';
import { finalize, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LoadingSpiner } from '../../models/loading-spiner/loading-spiner';

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
  imports: [LoadingSpiner],
})
export class TopicsComponent {
  @ViewChild('topicsChart', { static: true }) topicsChart!: ElementRef;
  private current_search_request?: Subscription;

  protected isLoading: boolean = false;
  protected topicGraph!: GraphForge;
  protected topics: Topic[] = [];
  protected selectedTopic: any;

  constructor(private readonly topicService: TopicApiService, private readonly router: Router) {}

  ngOnInit() {
    this.topicGraph = new GraphForge(this.topicsChart.nativeElement);

    this.topicGraph.onNodeSelect().subscribe((id) => this.onNodeClicked(id));
    this.topicGraph.onNodeDoubleClick().subscribe((id) => this.onNodeDoubleClicked(id));

    this.showAllTopics();
  }

  // ========== PRIVATE METHODES ========== //

  private onNodeDoubleClicked(id: string): void {
    const topic_id: number = this.topicGraph.getNodeID(id);
    const topic: Topic | undefined = this.getTopicByID(topic_id);

    if (topic) this.redirectToProjects(topic);
  }

  private redirectToProjects(topic: Topic): void {
    this.router.navigate(['/projects'], { queryParams: { topics: topic.name } });
  }

  private onNodeClicked(id: string) {
    const true_id = this.topicGraph.getNodeID(id);
    const topic = this.getTopicByID(true_id);
    if (topic) {
      this.selectedTopic = topic;
    }
  }

  private showAllTopics(): Subscription {
    this.isLoading = true;
    return this.topicService
      .getTopics()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((topics) => {
        this.fill(topics);
      });
  }

  private fill(topics: Topic[]) {
    topics.forEach((topic) => {
      this.topicGraph.createTopic(topic, topic.total_projects_count);
      this.topics.push(topic);
    });
    this.topics.sort((a: any, b: any) => b.total_projects_count - a.total_projects_count);
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

  // ========== PROTECTED METHODES ========== //

  protected serach(query: string): void {
    if (this.current_search_request) this.current_search_request.unsubscribe();

    if (query.length == 0) {
      this.current_search_request = this.showAllTopics();
      return;
    }

    this.topics = [];
    this.isLoading = true;
    this.topicGraph.clear();
    this.current_search_request = this.topicService
      .getTopicsMatchSearch(query)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.topicGraph.fit();
        })
      )
      .subscribe((rep) => {
        this.fill(rep);
      });
  }

  protected subjectSelected(topic: Topic) {
    this.selectedTopic = topic;
    this.topicGraph.selectNode(this.topicGraph.generateID(NodeType.SUBJECT, topic.id.toString()));
  }

  protected test2clickEvent(elt: any): void {
    let t = this.topicGraph.generateID(elt?.type, elt.id);
  }

  protected exploreClick(): void {
    this.redirectToProjects(this.selectedTopic);
  }
}
