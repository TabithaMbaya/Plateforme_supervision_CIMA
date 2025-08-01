# Plateforme de Supervision - Gestion des Opérations et Profilage Clients

## Description

Cette plateforme web permet de superviser, filtrer, ajouter, modifier et supprimer des opérations financières, tout en identifiant les opérations à risque élevé. Elle offre également un suivi des comptes et un profilage des clients.  
L’interface est conçue pour être claire, intuitive, responsive, et conforme aux codes couleurs professionnels.

## Fonctionnalités principales

- **Navigation fluide** avec un header fixe et une barre latérale pour accéder aux sections :
  - Accueil, Profilage, Opérations, Alertes, Comptes.
- **Filtrage dynamique** 
    - des opérations selon date, montant minimum, client et niveau de risque.
    - les clients selon le type, produit et niveau de risque.
- **Affichage clair des opérations** avec mise en évidence animée des opérations suspectes.
- **Affichage clair des profilages des clients** avec mise en couleur des risques.
- **Ajout et modification** d’opérations; des clients et des comptes via des formulaires intégrés, avec validation simple.
- **Suppression d’opérations** directement depuis le tableau et la liste des clients.
- **Chargement des données** depuis des fichiers JSON (`operations.json`, `comptes.json`, `clients.json`).
- **Export des alertes** suspectes en fichier JSON téléchargeable.
- **Affichage des comptes** avec mise en surbrillance des comptes en découvert.
- **Responsive design** pour une utilisation fluide sur desktop et mobile.

### Fichiers clés

- `index.html`, `profilage.html`, `operations.html`, `alerte.html`, `compte.html` : pages principales du site.
- `style.css` : fichier CSS complet contenant la palette de couleurs, la mise en page et les styles spécifiques.
- `scriptOperation.js` : script JavaScript gérant le chargement, l’affichage, les filtres, et les interactions des opérations et des alertes.
- `scriptClient.js` : script JavaScript gérant le chargement, l’affichage, les filtres, et les interactions des clients.
- `script.js` : script JavaScript gérant le chargement, l’affichage et les interactions des des comptes bancaires et de l'affichage de page d'accueil.
- `operations.json` : données sources des opérations.
- `comptes.json` : données sources des comptes.

---

## Palette de couleurs (CSS variables)

| Variable         | Couleur    | Usage                        |
|------------------|------------|-----------------------------|
| `--primary`      | #8FCB9B    | Couleur principale           |
| `--primary-dark` | #0056b3    | Variante foncée              |
| `--danger`       | #dc3545    | Alertes, erreurs            |
| `--success`      | #28a745    | Succès, confirmations       |
| `--warning`      | #ffc107    | Avertissements              |
| `--light`        | #f8f9fa    | Fond clair                  |
| `--dark`         | #343a40    | Texte sombre                |
| `--gray`         | #6c757d    | Texte secondaire            |
| `--bg`           | #f4f6f8    | Fond global                 |
| `--white`        | #ffffff    | Blanc                      |


### Technologies utilisées

| Technologie      | Usage principal                                        |
|------------------|--------------------------------------------------------|
| **HTML5**        | Structure sémantique                                   |
| **CSS3 (Flex + Grid)** | Mise en page responsive                             |
| **Media Queries**| Adaptation à l'écran (mobile/tablette/desktop)         |
| **JavaScript**   | Logique métier, statistiques, filtrage client-side     |
| **jQuery**       | DOM simplifié, chargement des données JSON             |
| **Chart.js**     | Visualisation graphique (barres, camemberts, etc.)     |


## Structure HTML & CSS

- **Header** : fixe en haut avec fond vert CIMA (#28a745).
- **Navbar latérale** : fixe sous le header, vert clair (#8FCB9B), avec liens stylisés et mise en surbrillance du lien actif.
- **Contenu principal** : marge ajustée pour navbar et header, padding confortable, fond clair.
- **Formulaires** : flexibles, avec champs arrondis, et boutons colorés selon l’action (vert pour ajouter, rouge pour annuler, bleu pour enregistrer).
- **Tableaux** : larges, avec en-tête sombre et lignes alternées, animation clignotante pour opérations suspectes.
- **Responsivité** : la navbar devient horizontale, les tableaux scrollables horizontalement, et les formulaires passent en colonne sur petits écrans.

---

## Fonctionnalités JavaScript (jQuery)

- Chargement des données depuis fichiers JSON.
- Affichage dynamique des opérations, comptes et alertes dans les tableaux.
- Affichage dynamique des clients dans des listes.
- Filtrage avancé par date, montant, client, et risque.
- Ajout, modification et suppression d’opérations, des comptes et des clients avec mise à jour instantanée de la table.
- Export des alertes suspectes au format JSON.
- Animation visuelle des lignes à risque.
- Gestion d’interactions (boutons, formulaires) avec effets de glissement (slideToggle).
- Validation simple des formulaires (champs requis).
- Gestion du contexte de page pour afficher les éléments pertinents.


### Autres choix de conception

-  Fichiers JSON simulant une base de données
-  Code JavaScript modulaire (fichiers séparés)
-  Design simple mais clair, adapté à un usage professionnel
-  Code commenté pour faciliter la lecture
-  Structure HTML conforme aux standards modernes

## Installation & Utilisation

1. (https://github.com/TabithaMbaya/Plateforme_supervision_CIMA.git)
2. Placer `operations.json` et `comptes.json` dans le même dossier que les pages HTML.
3. Ouvrir `operations.html` (ou autre page) dans un navigateur moderne.
4. Utiliser le menu latéral pour naviguer.
5. Ajouter, filtrer, modifier ou supprimer des opérations via les formulaires et boutons.
6. Exporter les alertes suspectes en cliquant sur le bouton dédié.
7. Sur mobile, la navigation s’adapte automatiquement.

---

## Exemple d’entrée dans `operations.json`

```json
[
  {
    "id": 1,
    "date": "2025-07-30",
    "client": "Jean Dupont",
    "montant": 15000000,
    "type": "virement",
    "risque": true,
    "commentaire": "Montant élevé suspect"
  },
  {
    "id": 2,
    "date": "2025-07-31",
    "client": "Alpha Corp",
    "montant": 5000000,
    "type": "paiement",
    "risque": false,
    "commentaire": ""
  }
]
