import { ProjectsComponent } from './pages/projects-page/projects-page.component';
import { AccueilComponent } from './pages/accueil-page/accueil-page.component';
import { FavorisComponent } from './pages/favoris-page/favoris-page.component';
import { TopicsComponent } from './pages/topics-page/topics-page.component';
import { Routes } from '@angular/router';
import { ModelePage } from './pages/modele-page/modele-page';

export const routes: Routes = [
  {
    path: 'subjects',
    component: TopicsComponent,
  },
  {
    path: 'projects',
    component: ProjectsComponent,
  },
  {
    path: 'favoris',
    component: FavorisComponent,
  },
  {
    path: 'accueil',
    component: AccueilComponent,
  },
  {
    path: 'modeles',
    component: ModelePage,
  },
  {
    path: '**',
    redirectTo: '/accueil',
  },
];
