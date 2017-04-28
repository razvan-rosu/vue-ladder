/* -----------------------
 * atom component: player
------------------------ */
var player = Vue.component('player', {
  props: {
    name: {
      type: String,
      required: true
    },
    winnerSettled: {
      type: Boolean,
      default: false
    }
  },

  template: '#template-player',

  data() {
    return {
      qualified: null
    }
  },

  methods: {
    qualifyPlayer() {
      this.qualified = true;
      this.$emit('resolve-match', this.name);
    }
  }
})

/* -----------------------
 * molecule component: match
------------------------ */
var match = Vue.component('match', {
  components: {
    'player': player
  },

  props: {
    players: {
      type: Array,
      required: true
    }
  },

  template: '#template-match',

  data() {
    return {
      matchPlayed: false,
      winner: null
    }
  },

  created: function() {
    this.$on('resolve-match', this.playMatch);
  },

  beforeDestroy: function() {
    this.$off('resolve-match', this.playMatch);
  },

  methods: {
    playMatch: function(winner) {
      this.matchPlayed = true;
      this.winner = winner;

      this.$eventHub.newTournament.push(this.winner);
      // console.log(this.$eventHub.newTournament);
    }
  }
})

/* -----------------------
 * organism component: tournament
------------------------ */
var tournament = Vue.component('tournament', {
  components: {
    'match': match
  },

  props: {
    matches: {
      type: Array,
      required: true
    },
  },

  template: '#template-tournament',

  data() {
    return {

    }
  }
})

/* -----------------------
 * template component: league
------------------------ */
var league = Vue.component('league', {
  components: {
    'tournament': tournament
  },

  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: true
    },
    players: {
      type: Array,
      required: true
    }
  },

  template: '#template-league',

  data() {
    return {
      tournaments: [],
      newPlayerName: '',
    }
  },

  methods: {
    addPlayer() {
      if (this.newPlayerName !== '') {
        Vue.set(this.players, this.players.length, this.newPlayerName);
        this.newPlayerName = '';
      }
      this.setTournaments();
    },
    randomizePlayers() {
      var shuffled = _.shuffle(this.players);
      var shuffledMatches = _.chunk(shuffled, 2);
      Vue.set(this.tournaments, 0, shuffledMatches);
    },
    addTournament() {
      var tournament = this.$eventHub.newTournament;
      tournament = this.setMatches(tournament);

      Vue.set(this.tournaments, this.tournaments.length, tournament);

      this.$eventHub.newTournament = [];
    },
    setMatches(players) {
      return _.chunk(players, 2);
    },
    setTournaments() {
      var allTournaments = [];
      var initialTournament = this.setMatches(this.players);

      allTournaments = initialTournament;

      Vue.set(this.tournaments, 0, allTournaments);
    }
  },

  created() {
    this.setTournaments();
  }
})

/* -----------------------
 * event hub
------------------------ */
var eventHub = new Vue({
  data() {
    return {
      newTournament: []
    }
  }
});
Vue.prototype.$eventHub = eventHub;

/* -----------------------
 * vue instance
------------------------ */
var app = new Vue({
  el: '#app',

  components: {
    'league': league
  },

  data: {
    pageTitle: 'Ladder',
    formTitle: 'Add new player',
    // players: []
    players: ['catalin', 'cosmin', 'mircea', 'irina', 'ana', 'claudiu', 'lucian', 'razvanr', 'maria', 'monica', 'razvan']
  }

})
