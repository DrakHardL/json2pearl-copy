import { Routes } from '@angular/router';
import { TopicFinder } from './topic-finder/topic-finder.component';
import { ProjectFinder } from './project-finder/project-finder';
import { TestProjectFinder } from './test-project-finder/test-project-finder.component';
import { TestFavoris } from './test-favoris/test-favoris';

export const routes: Routes = [
  {
    path: '',
    component: ProjectFinder,
  },
  {
    path: 'subjects',
    component: TopicFinder,
  },
  {
    path: 'projects',
    component: TestProjectFinder,
  },
  {
    path: 'favoris',
    component: TestFavoris,
  },
];
