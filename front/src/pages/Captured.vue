<template lang="pt-br">
  <div class="captured">
    <h1>Pokémons Capturados</h1>
      <b-alert
          :show="dismissCountDown"
          dismissible
          fade
          variant="danger"
          @dismiss-count-down="countDownChanged"
          >
          {{ pokemon }}
      </b-alert>
    <b-container>
      <b-form-input
        id="input-1"
        v-model="search"
        placeholder="Procurar Pokémon"
      ></b-form-input>
      <b-row align-h="around">
        <ul class="list-unstyled">
          <b-media
            tag="li"
            v-for="(pokemon, index) in filteredList"
            :key="index"
          >
            <template #aside>
              <b-img
                :src="pokemon.image"
                width="64"
                :alt="pokemon.name"
              ></b-img>
            </template>
            <h5 class="mt-0 mb-1">
              #{{ pokemon.id }}
              {{ pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) }}
            </h5>
            <b-badge
              @click="getPokemons(pokemon.types[0])"
              v-b-modal.modal-2
              :class="pokemon.types[0]"
              >{{ pokemon.types[0] }}</b-badge
            >
            <b-badge
              @click="getPokemons(pokemon.types[1])"
              v-b-modal.modal-2
              :class="pokemon.types[1]"
              >{{ pokemon.types[1] }}</b-badge
            >
            <b-icon
              icon="x-circle"
              @click="deletePokemon(pokemon.name, index)"
              scale="1.5"
              variant="danger"
            ></b-icon>
            <b-icon
              icon="info-circle-fill"
              v-b-modal.modal-1
              @click="pokemonTempData(pokemon)"
              scale="1.5"
              variant="success"
            ></b-icon>
            <hr />
          </b-media>
        </ul>
      </b-row>
    </b-container>
    <b-modal id="modal-1" :title="tempData.name">
      <b-img :src="tempData.image" width="150" :alt="tempData.name"></b-img>
      <h5>
        <b-badge
          v-for="(types, index) in tempData.types"
          :key="index"
          :class="tempData.types[index]"
          v-b-modal.modal-2
          @click="getPokemons(tempData.types[index])"
          >{{ tempData.types[index] }}</b-badge
        >
      </h5>
      <b-container>
        <b-row>
          <strong>Movimentos:</strong>
          <b-list-group flush title="Movimentos:">
            <b-list-group-item
              v-for="(moves, index) in tempData.moves"
              :key="index"
              >{{ tempData.moves[index].name }}
              <b-button
                id="tooltip-target-1"
                v-b-tooltip.hover
                variant="primary"
                :title="tempData.moves[index].short_effect"
              >
                <b-icon
                  icon="chevron-compact-up"
                  scale="1.5"
                  variant="light"
                ></b-icon> </b-button
            ></b-list-group-item>
          </b-list-group>
          <b-tooltip target="tooltip-target-1" triggers="hover"> </b-tooltip>

          <b-container class="captured-pokemon-details" >
            <p>Peso: {{ tempData.weight / 10 }} kg</p>
            <p>Altura: {{ tempData.height / 10 }} m</p>
            <p>Vida: {{ tempData.hp }}</p>
            <p>Ataque: {{ tempData.attack }}</p>
            <p>Defesa: {{ tempData.defense }}</p>
            <p>Velocidade: {{ tempData.speed }}</p>
          </b-container>
        </b-row>
      </b-container>
    </b-modal>
    <b-modal id="modal-2" title="Pokémons">
      <b-row align-h="around">
        <Card
          v-for="(pokemon, index) in pokemonsByType"
          :key="index"
          :title="
            pokemon.pokemon.name.charAt(0).toUpperCase() +
            pokemon.pokemon.name.slice(1)
          "
          :image="imgURL + pokemon.pokemon.url.split('/')[6] + '.png'"
          :imgAlt="pokemon.pokemon.name"
        />
      </b-row>
    </b-modal>
  </div>

</template>
<script>
import Card from '../components/Card.vue';
import axios from "axios";
export default {
    components: {
        Card
    },
     data() {
    return {
      pokedex: [],
      pokemonsByType: [],
      tempData: {},
      search: "",
      imgURL:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/",
        dismissSecs: 1,
        dismissCountDown: 0,
        showDismissibleAlert: false,
        pokemon:""
    };
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    getPokedex() {
      this.pokedex = localStorage.getItem("Pokedex");
      this.pokedex = JSON.parse(this.pokedex);
    },
    deletePokemon(name, id) {
      this.pokedex.splice(id, 1);
      localStorage.setItem("Pokedex", JSON.stringify(this.pokedex));
      this.pokemon = (name + " excluído da pokedex!").toUpperCase();
      this.dismissCountDown = this.dismissSecs
    },
    pokemonTempData(pokemon) {
      this.tempData = pokemon;
      this.tempData.name =
        this.tempData.name.charAt(0).toUpperCase() +
        this.tempData.name.slice(1);
    },
    getPokemons(type) {
      let urlType;
      axios
        .get("https://pokeapi.co/api/v2/type/")
        .then((res) => {
          res.data.results.forEach((element) => {
            if (element.name == type) {
              urlType = element.url;
            }
          });
          return urlType;
        })
        .then((res) => {
          axios.get(res).then((res) => {
            this.pokemonsByType = [];
            res.data.pokemon.forEach((element) => {
              this.pokemonsByType.push(element);
            });
          });
        });
    },
  },
  mounted() {
    this.getPokedex();
  },
  computed: {
    filteredList() {
      return this.pokedex.filter((pokemon) => {
        let name = pokemon.id + " " + pokemon.name;
        return name.toLowerCase().includes(this.search.toLowerCase());
      });
    },
  },
}
</script>
<style scoped>
  .captured {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  h1 {
    margin-bottom: 33px !important;
    font-size: 2rem;
  }
  .captured .container {
    padding: 1.3rem;
    height: 66vh;
    width: 60vw;
    overflow-y: scroll;
    background-color: #fff;
    border-radius: 15px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  }
  .badge {
    margin-left: 7px;
  }
  .captured svg {
    margin-left: 25px;
    float: right;
    cursor: pointer;
  }
  .modal-body {
    overflow-y: scroll;
  }
  .modal-content {
    height: 83vh !important;
  }
  .list-group {
    border: solid 2px #929292;
    border-radius: 10px !important;
    overflow-y: scroll;
    height: 30vh;
    padding: 0 !important;
    font-weight: bold;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
    width: 100%;
  }
  .captured-pokemon-details {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: left;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
    border: solid 2px #929292;
    border-radius: 10px !important;
    height: 35vh;
    margin-top: 5px;
    padding-top: 5px;
    width: 100%;
  }
  .captured-pokemon-details p {
    font-size: smaller;
    font-weight: bold;
  }
  .list-group-item {
    display: flex !important;
    justify-content: space-between;
  }
  .list-group-item .btn {
    display: flex !important;
    justify-content: center;
    align-items: center;
    font-size: smaller !important;
    font-weight: bold !important;
    height: 3vh;
    width: 3vw;
  }
  .normal {
    background-color: #81c784;
  }
  .fire {
    background-color: #fb8c00;
  }
  .fighting {
    background-color: #bf360c;
  }
  .water {
    background-color: #0277bd;
  }
  .flying {
    background-color: #b39ddb;
  }
  .grass {
    background-color: #00e676;
  }
  .poison {
    background-color: #673ab7;
  }
  .electric {
    background-color: #f3d23a;
  }
  .ground {
    background-color: #dcc16b;
  }
  .psychic {
    background-color: #f05189;
  }
  .rock {
    background-color: #cddc39;
  }
  .ice {
    background-color: #80d8ff;
  }
  .bug {
    background-color: #a7bb29;
  }
  .dragon {
    background-color: #4527a0;
  }
  .ghost {
    background-color: #7c4dff;
  }
  .dark {
    background-color: #5d4037;
  }
  .steel {
    background-color: #bcaaa4 ;
  }
  .fairy {
    background-color: #ffccbc;
  }
  .alert{
    width: 40%;
    display: flex;
    position: fixed;
    top: 30px;
    right: 0;
    z-index: 999;
  }
  ul{
    padding-top: 10px;
  }

</style>