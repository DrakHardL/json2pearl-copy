import { Routes } from '@angular/router';
import { TopicFinder } from './topic-finder/topic-finder.component';
import { ProjectFinder } from './project-finder/project-finder';

export const routes: Routes = [
  {
    path: '',
    component: ProjectFinder,
  },
  {
    path: 'subjects',
    component: TopicFinder,
  },
];
