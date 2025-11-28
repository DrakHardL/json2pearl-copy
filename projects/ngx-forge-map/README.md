# NgxForgeMap

Ce dépôt contient la bibliothèque Angular `ngx-forge-map` : un ensemble de composants, services et modèles destinés à afficher et manipuler une représentation graphique (forge map) de projets, groupes, topics et utilisateurs.

**Contenu principal**
- `src/lib/model/` : définitions de modèles (`graph-forge`, `group`, `project`, `topic`, `user`).
- `src/lib/services/` : services pour l'accès aux données et la logique métier (`api.service`, `group.service`, `project.service`, `topic.service`, `user.service`).
- `src/lib/pages/graph-demo/` : exemple de page/composant démonstration montrant l'utilisation de la carte.

**Objectif**
La bibliothèque fournit :
- Un point d'entrée Angular réutilisable pour intégrer une vue « forge map » dans une application.
- Des services pour récupérer, transformer et fournir les données aux composants.
- Des modèles TypeScript pour typer les entités manipulées.

Installation et usage
---------------------

1. Installer la bibliothèque (après publication sur npm) :

```powershell
npm install ngx-forge-map
```

2. Importer le module dans votre application Angular (vérifier le nom exact exporté dans `public-api.ts`) :

```ts
import { NgxForgeMapModule } from 'ngx-forge-map';

@NgModule({
   imports: [NgxForgeMapModule /*, ... */]
})
export class AppModule {}
```

3. Utiliser les composants exportés par la bibliothèque dans vos templates. (Consultez `public-api.ts` du projet pour connaître les composants/selcteurs exportés.)

Services et injection
---------------------

Les services principaux présents dans la bibliothèque :
- `ApiService` : encapsule les appels HTTP/REST vers le backend (points d'accès centralisés).
- `GroupService` / `ProjectService` / `TopicService` / `UserService` : services spécifiques aux entités, construisent les modèles attendus par les composants.

Dans vos composants, injectez simplement le service voulu :

```ts
constructor(private projectService: ProjectService) {}

ngOnInit() {
   this.projectService.list().subscribe(projects => this.projects = projects);
}
```

Modèles (models)
-----------------

Les fichiers `*.model.ts` définissent les interfaces TypeScript utilisées par la bibliothèque. Ils permettent de garantir la forme attendue des objets (projets, groupes, topics, utilisateurs, graph-forge).

Développement local
-------------------

- Builder la librairie :

```powershell
ng build ngx-forge-map
```

- Lancer les tests unitaires :

```powershell
ng test
```

- Exécuter les exemples/démo (si un app de démonstration est fourni dans le workspace) :

```powershell
ng serve
```

Publication
-----------

Après compilation, les artefacts se trouvent dans `dist/ngx-forge-map`. Pour publier sur npm :

```powershell
cd dist/ngx-forge-map; npm publish
```

Conseils et bonnes pratiques
---------------------------
- Consulter `projects/ngx-forge-map/src/public-api.ts` pour voir les symboles réellement exportés par la librairie.
- Les composants UI attendent des données au format des modèles fournis ; préférez utiliser les services fournis pour remplir ces modèles.
- Pour adapter l'apparence, surchargez les styles globaux de votre application ou fournissez des entrées (inputs) aux composants si la bibliothèque les expose.

Exemple minimal d'utilisation
-----------------------------

```html
<!-- Dans un template d'un composant d'application -->
<forge-graph-demo></forge-graph-demo>
```

```ts
// Dans le module
import { NgxForgeMapModule } from 'ngx-forge-map';

@NgModule({ imports: [NgxForgeMapModule] })
export class AppModule {}
```

Support & contribution
----------------------

Vous pouvez contribuer en ouvrant des issues ou des pull requests dans ce dépôt. Pour les développements locaux, travaillez sur la branche de fonctionnalité, ajoutez des tests et mettez à jour la documentation si nécessaire.

Fichiers utiles
---------------
- `src/lib/model/` : modèles de données.
- `src/lib/services/` : logique métier et intégration HTTP.
- `src/lib/pages/graph-demo/` : composant d'exemple et template.
- `public-api.ts` : export public de la librairie.

Licence
-------
Vérifiez la présence d'un fichier `LICENSE` à la racine du dépôt pour connaître la licence du projet.

---

Si vous voulez, je peux :
- ouvrir `public-api.ts` et générer automatiquement une section « API » listant précisément les composants/services exportés ; ou
- lancer un build et les tests locaux pour valider la compilation.

Indiquez la prochaine action souhaitée.
