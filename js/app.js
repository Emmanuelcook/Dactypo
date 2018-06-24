// Auteur : Emmanuel Cook
// Nom de l'application : Dactypo
// Version: 1.0



// 1. STORES ------------------------------



// Store pour le timer ---------------
class counterStore{

	constructor(){
		this.state = {
			count: 6,
			min: 60,
			ratiomot: 45,
			levelmot: 5,
			timeAdded: 0
		}
	}

	// Calcul du temps pour le prochain niveau
	start(){
		this.state.count = Math.trunc((this.state.min / this.state.ratiomot) * this.state.levelmot)
	}

	decrement(){
		this.state.count--
	}

	// Augmenter le niveau et recalculer le temps à ajouter pour les nouveaux mots. On garde le bonus de temps si on a été assez vite sur les niveaux précédents.
	levelup(){
		this.state.ratiomot++
		this.state.levelmot++
		this.state.count = Math.trunc((this.state.count + (this.state.min / this.state.ratiomot) * this.state.levelmot))
	}

	// Reset du Timer et du niveau de difficulté 1
	reset(){
		this.state.min = 60,
		this.state.ratiomot = 45,
		this.state.levelmot = 5,
		this.state.count = Math.trunc((this.state.min / this.state.ratiomot) * this.state.levelmot)
	}
}

let counter_store = new counterStore()



// Store pour le score ---------------
class scoreStore{

	constructor(){
		this.state = {
			score: 0
		}
	}

	// Ajouter des points pour les mots réussis (ici level 1 = 50, level 2 = 60)
	mottrouve(){
		this.state.score += ((niveau_store.state.wordperlevel + 1) * 10)
	}

	// Enlever des points par erreur (ici level 1 = 50, level 2 = 60)
	erreur(){
		this.state.score -= ((niveau_store.state.wordperlevel + 1) * 10)
	}

	// Reset score
	reset(){
		this.state.score = 0
	}
}

let score_store = new scoreStore()



// Store pour le niveau ---------------
class niveauStore{

	constructor(){
		this.state = {
			niveau: 1,
			counternextlevel: 4,
			wordperlevel: 4,
		}
	}

	// Augmenter de niveau quand on a rempli assez de mot
	goodmot(){
		if (this.state.counternextlevel === 0){
			this.state.wordperlevel++,
			this.state.counternextlevel = this.state.wordperlevel,
			this.state.niveau++,
			counter_store.levelup()
		} else {
			this.state.counternextlevel--
		}
	}

	// Reset niveau
	reset(){
		this.state.niveau = 1,
		this.state.counternextlevel = 4,
		this.state.wordperlevel = 4
	}
}

let niveau_store = new niveauStore()



// 2. COMPONENTS ------------------------------



// Timer ---------------
let counter = {
	data: function(){
		return{
			state: counter_store.state
		}
	},
	computed: {
		count: function(){
			return this.state.count
		}
	},
	template: `<div class="counter"><slot></slot> {{ count }}</div>`,
}



// Score ---------------
let score = {
	data: function(){
		return{
			state: score_store.state
		}
	},
	computed: {
		score: function(){
			return this.state.score
		}
	},
	template: `<div class="score"><slot></slot> {{ score }}</div>`,
}



// Niveau ---------------
let niveau = {
	data: function (){
		return{
			state: niveau_store.state,
		}
	},
	computed: {
		niveau: function (){
			return this.state.niveau
		}
	},
	template: `<div class="niveau"><slot></slot> {{ niveau }}</div>`,
}



// 3. APPLICATION ------------------------------



let vm = new Vue({

	// Appel de mon élément
	el: '#app',

	// Components
	components: { counter, score, niveau },

	data: {

		// Mots
		words: [],
		wordsToWrite: '',

		// Etapes du jeu
		success: true,
		lost: false,
		letLostOn: false,
		encouragementWord: '',
		condmakeItHarderWord: false,
		makeItHarderWord: '',
		playMessage: 'Play',

		// Timer
		isTicking: false,

		// Niveau
		makeItHarder: 0,
		nextLevel: false,

		// HelpOn
		helpOn: false,

		// Score
		user: '',
		score: 0,
		finalScore: 0,
		newScoreName: '',
		leaderboardOn: false,
		scoreMessage: '',
		scores: [
			{
				finalScore: 0,
				name: 'AAA',
			},
			{
				finalScore: 0,
				name: 'AAA',
			},
			{
				finalScore: 0,
				name: 'AAA',
			},
			{
				finalScore: 0,
				name: 'AAA',
			},
			{
				finalScore: 0,
				name: 'AAA',
			}
		]
	},

	computed: {

		niveauchange: function(){
			return niveau_store.state.niveau
		}

	},

	methods:{

		// Vérifier ce que l'utilisateur a écrit
		checkWord: function(index){

			// Si le mot est juste, enlever le mot, ajouter le score.
			if (this.wordsToWrite === this.words[0].word){
				this.success = true,
				this.words.shift(index),
				score_store.mottrouve(),
				niveau_store.goodmot()

				// verifier si c'est le dernier mot du niveau
				if (this.words.length === 0){
					this.makeItHarder++,
		    		this.condmakeItHarderWord = true

		    		// Passer au niveau de difficulté 2
					if (this.makeItHarder === 1){
						this.makeItHarderWord = 'Make. It. Harder.',
						axios
					      	.get('https://api.datamuse.com/words?sp=??????&max=60')
					      	.then( response => (this.words = response.data))
					}

					// Passer au niveau de difficulté 3
					else if (this.makeItHarder === 2){
						this.makeItHarderWord = 'HAR. DER.',
						axios
					      	.get('https://api.datamuse.com/words?sp=???????&max=85')
					      	.then( response => (this.words = response.data))
					} 

					// Passer au niveau de difficulté 4
					else if (this.makeItHarder === 3){
						this.makeItHarderWord = 'Is that all you got ?',
						axios
					    	.get('https://api.datamuse.com/words?sp=????????&max=110')
					    	.then( response => (this.words = response.data))
					}

					// Passer au niveau de difficulté 5
					else if (this.makeItHarder === 4){
						this.makeItHarderWord = 'Are you real ?',
						axios
					      .get('https://api.datamuse.com/words?sp=????????&max=135')
					      .then( response => (this.words = response.data))
					}

				} else { // s'il reste plus d'un mot
					this.makeItHarderWord = '',
		    		this.condmakeItHarderWord = false
				}

			} else { // Si le mot est faux 
				this.success = false,
				score_store.erreur(),
				this.makeItHarderWord = '',
	    		this.condmakeItHarderWord = false
			}

			// Effacer le champ de texte
			this.wordsToWrite = ''
			return false
		},

		// Mettre le timer en marche
		setTimer: function(){
			this.$interval = setInterval(() => {
				counter_store.decrement()

				// Si le timer arrive à 0, on l'arrête et on affiche vous avez lost !
				if (counter_store.state.count === 0){ 
					clearInterval(this.$interval),
					this.lost = true,
					this.isTicking = false,
					this.makeItHarder = 0,
					this.playMessage = 'Play again';
					this.makeItHarderWord = '',
					this.score = score_store.state.score

					// Personnalisation du message de fin de partie
					if(score_store.state.score >= 20000){
						this.scoreMessage = 'I don\'t believe you.'
					} else if (score_store.state.score >= 10000){
						this.scoreMessage = 'Wow, okay you\'re good.'
					} else if (score_store.state.score >= 5000){
						this.scoreMessage = 'Nice score ! Is it enough though ?'
					} else if (score_store.state.score >= 2500){
						this.scoreMessage = 'Meh, if you\'re okay with it.'
					} else if (score_store.state.score >= 0){
						this.scoreMessage = 'Well, that\'s pretty bad.'
					} else if (score_store.state.score < 0){
						this.scoreMessage = 'Really ? Come on.'
					}
				}
			}, 1000)
		},

		// Relancer une partie
		startAgain: function(){
			counter_store.reset(),
			niveau_store.reset(),
			score_store.reset(),
			this.wordsToWrite = '',
			this.lost = false,
			this.leaderboardOn = false,
			this.helpOn = false,
			axios
		        .get('https://api.datamuse.com/words?sp=?????&max=35')
		        .then( response => (this.words = response.data))
		},

		// Ajouter un score au leaderboard et aller sur la page leaderboard
		addNewScore: function(){
			this.scores.push({
		      	finalScore: this.score,
		        name: this.newScoreName
		    }),
		    counter_store.reset(),
			niveau_store.reset(),
			score_store.reset(),
			this.wordsToWrite = '',
		    this.newScoreName = '',
		    this.leaderboardOn = true,
		    this.lost = false,
		    this.letLostOn = false,
		    axios
		        .get('https://api.datamuse.com/words?sp=?????&max=35')
		        .then( response => (this.words = response.data))
	    },

	    // Afficher les scores dans l'ordre décroissant
	    even: function(arr){
      		return arr.slice().sort(function(a, b){
        		return b.finalScore - a.finalScore;
	      	});
	    },

	    // Clignoter rouge quand le timer est en dessous de 5
	    styleTimer: function(){
		    if (counter_store.state.count >= 6){
				this.isTicking = false
			} else if (counter_store.state.count === 0){
				this.isTicking = false
			} else {
				this.isTicking = true
			}
	    },

	    // Afficher les secondes ajoutées au timer à chaque nouveau niveau, peut être personnalisé en n'importe quel message d'encouragement
	    encouragementWordFunction: function(){
	    	if (niveau_store.state.wordperlevel === 4){
	    		this.encouragementWord = '',
	    		this.nextLevel = false
	    	} else if (niveau_store.state.counternextlevel === niveau_store.state.wordperlevel){
				this.encouragementWord = '+' +  Math.trunc((counter_store.state.min / counter_store.state.ratiomot) * counter_store.state.levelmot) + 'sec',
				this.nextLevel = true
	    	} else {
	    		this.encouragementWord = '',
	    		this.nextLevel = false
	    	}
	    },

	    toggleLeaderboard: function(){
	    	if (this.leaderboardOn === false && this.lost === true){
	    		this.leaderboardOn = true,
	    		this.helpOn = false,
	    		this.letLostOn = true,
	    		this.lost = false
	    	} else if (this.leaderboardOn === false && this.lost === false){
	    		this.helpOn = false,
	    		this.leaderboardOn = true
	    	} else if (this.leaderboardOn === true && this.letLostOn === true){
	    		this.helpOn = false,
	    		this.leaderboardOn = false,
	    		this.lost = true
	    	} else {
	    		this.leaderboardOn = false
	    	}
	    },

	    toggleHelp: function(){
	    	if (this.helpOn === false && this.lost === true){
	    		this.helpOn = true,
	    		this.leaderboardOn = false,
	    		this.letLostOn = true,
	    		this.lost = false
	    	} else if (this.helpOn === false && this.lost === false){
	    		this.helpOn = true,
	    		this.leaderboardOn = false
	    	} else if (this.helpOn === true && this.letLostOn === true){
	    		this.helpOn = false,
	    		this.leaderboardOn = false,
	    		this.lost = true
	    	} else {
	    		this.helpOn = false
	    	}
	    }

	},

	// Ce qu'il faut faire une fois que le html est monté
	mounted: function(){
		counter_store.start(),
	   	axios
	      .get('https://api.datamuse.com/words?sp=?????&max=35')
	      .then( response => (this.words = response.data)),
	      this.$refs.wordsToWrite.focus();
	 },

	// Une fois qu'on a détruit qqchose, annuler toutes les fonctions qui tournent
	destroyed: function(){
		clearInterval(this.$interval)
	},
})