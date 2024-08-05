"use strict";

const pokemonAPIURL = new URL("https://pokeapi.co/api/v2/pokemon?limit=1126");
let listaPokemon = [];
const form = document.querySelector("form.buscador");
const searchInput = document.querySelector("input[type='search']");
const suggestions = document.querySelector(".suggestions");
const buscarBtn = document.getElementById("buscarBtn");
const informacionPokemon = document.querySelector(".informacionPokemon");

// Función para obtener la lista completa de Pokémon
async function buscadorTOTAL() {
  try {
    const response = await fetch(pokemonAPIURL);

    if (!response.ok) {
      throw new Error("La web no responde");
    }

    const data = await response.json();
    listaPokemon = data.results; // Guardamos la lista de Pokémon
  } catch (error) {
    console.error("No has podido fetchear", error);
  }
}

// Llamamos a la función para obtener la lista de Pokémon
buscadorTOTAL();

// Función para filtrar Pokémon por nombre
function buscarPorNombre(name) {
  return listaPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(name.toLowerCase())
  );
}

// Función para mostrar sugerencias
function mostrarSugerencias() {
  const query = searchInput.value;
  const resultados = buscarPorNombre(query);

  // Limpiar sugerencias anteriores
  suggestions.innerHTML = "";

  // Mostrar nuevas sugerencias
  resultados.forEach((pokemon) => {
    const li = document.createElement("li");
    li.textContent = pokemon.name;
    li.addEventListener("click", () => {
      searchInput.value = pokemon.name;
      mostrarInformacionPokemon(pokemon.name);
      suggestions.innerHTML = ""; // Limpiar sugerencias
    });
    suggestions.appendChild(li);
  });

  if (resultados.length === 0) {
    suggestions.innerHTML = "<li>No se encontraron resultados</li>";
  }
}

// Función para obtener y mostrar la información de un Pokémon
async function mostrarInformacionPokemon(nombre) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`
    );

    if (!response.ok) {
      throw new Error("No se pudo obtener la información del Pokémon");
    }

    const data = await response.json();
    informacionPokemon.innerHTML = `
      <h2>${data.name}</h2>
      <img src="${data.sprites.front_default}" alt="${data.name}">
      <img src="${data.sprites.back_default}" alt="${data.name}">
      <p>Altura: ${data.height / 10} m</p>
      <p>Peso: ${data.weight / 10} kg</p>
            <p>Puntos de vida: ${
              data.stats.find((stat) => stat.stat.name === "hp").base_stat
            }</p>
      <p>Ataque: ${
        data.stats.find((stat) => stat.stat.name === "attack").base_stat
      }</p>
      <p>Defensa: ${
        data.stats.find((stat) => stat.stat.name === "defense").base_stat
      }</p>
      <p>Velocidad: ${
        data.stats.find((stat) => stat.stat.name === "speed").base_stat
      }</p>
      <p>Tipo: ${data.types
        .map((typeInfo) => typeInfo.type.name)
        .join(", ")}</p>
     
    `;
  } catch (error) {
    informacionPokemon.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// Añadir listener al input de búsqueda
searchInput.addEventListener("input", mostrarSugerencias);

// Añadir listener al botón de búsqueda
buscarBtn.addEventListener("click", () => {
  const nombre = searchInput.value.trim();
  if (nombre) {
    mostrarInformacionPokemon(nombre);
  }
});
