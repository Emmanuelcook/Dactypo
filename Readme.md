# Starter

**Dactypo est un jeu de rapidité au clavier.
Le but étant d'écrire le plus de mots possible dans un temps donné.**

[Live demo](https://emmanuelcook.fr/dactypo)

## v2.0 évolutions

*Je suis pas encore sûr de continuer ce projet, mais j'ai pensé à des améliorations qui pourraient être sympa :*

- [ ] Le `@keydown.space` pour valider les mots ne fonctionnent pas encore et pourtant c'est un reflex qui me vient très naturellement d'écrire les mots en les séparant par des espaces (malgré le fonctionnement du jeu). Une autre possibilité pourrait être du valider le mot dès qu'il est écrit convenablement. Dans ce cas là il faudrait revoir le système de perte de points lors d'un mot érroné.
- [ ] Le trigger de l'erreur qui active un shake du mot ne marche qu'une fois par mot pour l'instant.
- [ ] La diffilculté et les niveaux ne sont pas infinis. Même si finir le niveau 5, je veux bien voir, ce serait intéressant de voir comment le rendre infini. 
- [ ] Ajouter un compteur pour les mots qu'ils restent à taper avant de passer au niveau suivant. C'est super frustrant de voir le timer devenir rouge, et de ne pas savoir combien de mots il nous reste à taper.
- [ ] Stocker les scores pour les garder et ne plus les perdre à chaque refresh.
- [ ] Autofocus le champs pour écrire les mots lors du click sur `Play again`

## Améliorations de code

J'ai le sentiment d'avoir utilisé les `class` de la mauvaise façon. Je m'en suis rendu compte en les utilisant et en pensant à les ré-utiliser. Il faudrait que chaque `class` ne comprenne uniquement que les fonctions vraiment "core" à son utilisation. 
Ex: Timer : Init, Reset, Start, Stop

## API

j'ai utilisé la très bonne API [Datamuse](https://www.datamuse.com/) pour générer les listes de mots.

## Information Inutile

:clock1030: 
J'ai passé entre 25h et 30h sur l'ensemble de ce projet.




