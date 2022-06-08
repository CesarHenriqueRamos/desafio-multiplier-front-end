<template lang="pt-br">
    <div class="home">
        <h1>Pokémons</h1>
        <b-container>
            <b-alert
                :show="dismissCountDown"
                dismissible
                fade
                variant="success"
                @dismiss-count-down="countDownChanged"
                >
                {{ pokemon }}
            </b-alert>
        </b-container>
            
        <b-container>
            <b-row align-h="around">
                <Card
                v-for="(pokemon, index) in pokemonList"
                :key="index"
                :title="pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)"
                :image="imgURL + (index + 1) + '.png'"
                :imgAlt="pokemon.name"
                >
                <b-button
                    @click="getPokemonData(index + 1, pokemon.name, pokemon.url)"
                    variant="primary"
                    >Capturar</b-button
                >
                </Card>
            </b-row>
        </b-container>
  </div>
</template>
<script>
import Card from '../components/Card.vue';
import axios from "axios";
import Pokedex from 'pokedex-promise-v2';
export default {
    components: { 
        Card 
    },
    data() {
        return {
        pokemonList: [],
        pokedex: [],
        imgURL:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/",
        dismissSecs: 1,
        dismissCountDown: 0,
        showDismissibleAlert: false,
        pokemon:""
        };
    },
    mounted() {
        this.getPokemons();
        this.$root.$on('search',this.filteredList)
    },
     computed: {
    
  },
  methods: {
    countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
    },
    getPokemons() {
      let P = new Pokedex();
      let interval = this.pokemonInterval();
      P.getPokemonsList(interval).then((res) => {
        this.pokemonList = res.results;
      });
    },
    pokemonInterval() {
      let interval = {
        limit: 500,
        offset: 0,
      };
      return interval;
    },
    getPokemonData(id, name, url) {
      axios
        .get(`${url}`)
        .then((res) => {
          return this.setPokemon(id, name, res);
        })
        .then((pokemon) => {
          setTimeout(() => {
            this.setLocalStorage(pokemon);
            this.pokemon = (pokemon.name + " capturado!").toUpperCase();
            this.dismissCountDown = this.dismissSecs
          }, 100);
        });
    },
    setLocalStorage(pokemon) {
      this.pokedex = localStorage.getItem("Pokedex");
      if (this.pokedex) {
        this.pokedex = JSON.parse(this.pokedex);
        this.pokedex.push(pokemon);
        this.pokedex.sort(this.compareId);
      } else {
        this.pokedex = [pokemon];
      }
      localStorage.setItem("Pokedex", JSON.stringify(this.pokedex));
    },
    compareId(element1, element2) {
      if (element1.id > element2.id) {
        return 1;
      } else if (element1.id < element2.id) {
        return -1;
      }
    },
    setPokemon(id, name, res) {
      let info = {
        id: id,
        name: name,
        image: res.data.sprites.front_default,
        hp: res.data.stats[0].base_stat,
        attack: res.data.stats[1].base_stat,
        defense: res.data.stats[2].base_stat,
        speed: res.data.stats[5].base_stat,
        weight: res.data.weight,
        height: res.data.height,
        types: [],
        moves: [],
      };
      res.data.types.forEach((element) => {
        info.types.push(element.type.name);
      });
      res.data.moves.forEach(async (element) => {
        let Pokedex = require("pokedex-promise-v2");
        let P = new Pokedex();
        let move = {};
        move.name = element.move.name;
        try {
          const moveFromApi = await P.getMoveByName(move.name);
          move.short_effect = moveFromApi.effect_entries[0].short_effect;
        } catch (err) {
          console.log(err);
        }
        info.moves.push(move);
      });
      return info;
    },
  }
}
</script>
<style scoped>
.home {
  display: flex;
  align-items: center;
  flex-direction: column;
}
h1 {
    margin-bottom: 30px;
    font-size: 2rem;
}
.alert{
  width: 40%;
  display: flex;
  position: fixed;
  top: 30px;
  right: 0;
  z-index: 999;
}
</style>