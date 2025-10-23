import { Routes } from '@angular/router';
import { TestGraph } from './test-graph/test-graph';
import { TopicFinder } from './topic-finder/topic-finder.component';

export const routes: Routes = [
  {
    path: '',
    component: TestGraph,
  },
  {
    path: 'subjects',
    component: TopicFinder,
  },
];
