const pokemonList = document.querySelector("#pokemonList");

const defaultPokemon = "https://pokeapi.co/api/v2/pokemon/1/";
const pokemonCard = document.querySelector("#pokemonCard");

window.addEventListener("load", (e) => {
	getPokemonList().then(() => {
		showPokemonCard(defaultPokemon);
	});

	pokemonList.addEventListener("change", (e) => {
		showPokemonCard(e.target.value);
	});

	registerServiceWorker();
});

async function getPokemonList() {
	const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=35");
	const json = await response.json();

	pokemonList.innerHTML = json.results.map(
		(result) => `<option value="${result.url}">${result.name}</option>`
	);
}

function createCard(pokemon) {
	return `
  <div class="card-header">
    <h2>#${pokemon.id}</h2>
  </div>
  <img class="card-img-top" src="${pokemon.sprites.other.dream_world.front_default}" alt="Card image cap" width="150" height="150">
  <div class="card-body">
    <h3 class="card-title" style="text-transform: capitalize">${pokemon.name}</h3>
    <div class="badge badge-warning">Height: ${pokemon.height}</div>
    <div class="badge badge-danger">Weight: ${pokemon.weight}</div>
  </div>
  `;
}

function offLineCard() {
	return `
		<div class="card-header">
			<p>Network is unavailable</p>
		</div>
	`;
}

async function showPokemonCard(url) {
	try {
		const response = await fetch(url);
		const json = await response.json();

		pokemonCard.innerHTML = createCard(json);
	} catch (err) {
		console.log("Network is unavailable");
		pokemonCard.innerHTML = offLineCard();
	}
}

async function registerServiceWorker() {
	if ("serviceWorker" in navigator) {
		try {
			await navigator.serviceWorker.register("sw.js");
		} catch (err) {
			console.error("Failed: ", error);
		}
	}
}
