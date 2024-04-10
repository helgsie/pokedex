import './index.css';
import React, { useState, useEffect } from 'react';
import Pokemon from './components/pokemon';
import TypeList from './components/typelist';
import searchIcon from './search-interface-symbol.png';
import Loading from './components/Loading';

function App() {
  const typeColorMap = {
    'normal': 'bg-neutral-400',
    'fire': 'bg-orange-500',
    'water': 'bg-blue-400',
    'poison': 'bg-purple-500',
    'grass': 'bg-lime-500',
    'ghost': 'bg-violet-700',
    'ice': 'bg-sky-200',
    'dark': 'bg-yellow-900',
    'bug': 'bg-lime-600',
    'electric': 'bg-amber-300',
    'ground': 'bg-yellow-500',
    'fairy': 'bg-rose-300',
    'flying': 'bg-violet-300',
    'fighting': 'bg-red-700',
    'psychic': 'bg-pink-400',
    'steel': 'bg-slate-400',
    'rock': 'bg-yellow-600',
    'dragon': 'bg-violet-500',
  };

  const [pokemons, setPokemons] = useState([]);
  const [searchedPokemons, setSearchedPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTypes, setShowTypes] = useState(false);
  const [types, setTypes] = useState([]);
  let limitPerPage = 1017;
  const totalPokemonCount = 1017;
  /*const totalPageCount = Math.ceil(searchedPokemons.length / limitPerPage);*/

  const renderPageNumbers = () => {
    const pageNumbers = [];
    limitPerPage = 40;
    pageNumbers.push(
    <button
      key='previous'
      className='mx-6'
      onClick={() => setCurrentPage(currentPage - 1)}
      hidden={currentPage === 1}
    >← Fyrri
    </button>
    );

    for (let i = 1; i <= 26; i++) {
      if (
        i === 1 ||
        i === currentPage - 2 ||
        i === currentPage - 1 ||
        i === currentPage ||
        i === currentPage + 1 ||
        i === currentPage + 2 ||
        i === 26
      ) {
        pageNumbers.push(
          <button
            key={i}
            className={`px-3 py-1 ${
              i === currentPage ? 'bg-lime-500 text-white rounded-full' : 'bg-white'
            }`}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        );
      }

      else if (i === 2) {
        pageNumbers.push(
          <span key="ellipsis-1" className="mx-2 text-black">
            ...
          </span>
        );
      }
      else if (i === 25 && currentPage < 23) {
        pageNumbers.push(
          <span key="ellipsis-2" className="mx-2 text-black">
            ...
          </span>
        );
      }
    }

    pageNumbers.push(
      <button
        key='next'
        className='mx-6'
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === 26}
      >Næsta →
      </button>
      );

    return pageNumbers;
  };

  // Sækjum gögn um Pokémon úr API
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        setLoading(true);

        const offset = (currentPage - 1) * limitPerPage;
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limitPerPage}&${searchQuery}`);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const results = data?.results ?? [];

        const mappedPokemons = await Promise.all(results.map(async (pokemon) => {
        const id = pokemon.url.split('/').slice(-2, -1)[0];
        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);

        const pokemonDetails = await pokemonResponse.json();
        const imageContent = pokemonDetails.sprites.other['official-artwork'].front_default;
        const image = imageContent !== null ? imageContent : pokemonDetails.sprites.front_default;
        pokemon.name = pokemon.name.replace(/-/g, ' ');
        const types = pokemonDetails.types.map(type => type.type.name);
        const primaryType = types[0];
        const secondaryType = types[1];

        const typeColor = typeColorMap[primaryType] || 'bg-white';
        const secondaryColor = typeColorMap[secondaryType] || 'bg-white';
        
        return {
          img: image,
          index: pokemonDetails.id,
          name: pokemon.name,
          type: primaryType,
          secondary: secondaryType,
          typeColor: typeColor,
          secondaryColor: secondaryColor
        };
      }));
        setPokemons(mappedPokemons);
        setSearchedPokemons(mappedPokemons);
      }
      catch (error) {
        console.error('Error fetching Pokemon data:', error);
      } finally {
        setLoading(false); // Stilla loading á false
      }
    };

    fetchPokemons();
  }, [currentPage, limitPerPage]);

  // Sækjum Pokémon týpur úr API fyrir types síðuna
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/type');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const types = data?.results ?? [];
        setTypes(types);

      } catch (error) {
        console.error('Error fetching types:', error);
      }
    };
  
    fetchTypes();
  }, []);
  
  // Virkni fyrir leitargluggann
  useEffect(() => {
      if (searchQuery.trim() === '') {
        setSearchedPokemons(pokemons);
      }
      else{
        const searched = pokemons.filter((pokemon) => {
          const nameMatches = pokemon.name.toLowerCase().startsWith(searchQuery.toLowerCase());
          const typeMatches = pokemon.type.toLowerCase() === searchQuery.toLowerCase() ||
          (pokemon.secondary && pokemon.secondary.toLowerCase() === searchQuery.toLowerCase());
    
          return nameMatches || typeMatches;
        });
        setSearchedPokemons(searched);
      }
  
  }, [searchQuery, pokemons]);
  
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  } 

  // HTML-ið sem á að birtast á vefsíðunni
  return (
    <div className="App">
      <div className="flex flex-col gap-4 h-full min-h-full">
        <header className="flex justify-between items-center w-11/12 m-auto max-w-7xl prose">
          <a href="/"><h1 className="text-red-400 mb-0 w-80 sm:w-full">Pokémon database</h1></a>
          <div className="">
            <li className="flex gap-5 place-items-center">
              <a href="/" className="not-prose"><ul className="px-3 py-1 border-2 border-red-400 hover:bg-red-400 transition ease-in-out rounded-3xl">Pokédex</ul></a>
              <a href="/" className="not-prose" onClick={(e) => {e.preventDefault(); setShowTypes(true); }}><ul className="px-3 py-1 border-2 border-red-400 hover:bg-red-400 transition ease-in-out rounded-3xl">Types</ul></a>
              <ul className="w-12"><img src={searchIcon} alt=""/></ul>
            </li>
          </div>
        </header>
        <main>
          {showTypes ? (
            <div>
              <h2 className="text-slate-700 font-bold text-3xl text-center mb-8">Pokémon týpur</h2>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 w-11/12 mx-auto mb-8 max-w-7xl">
              {types
                .filter((type) => type.name !== 'unknown' && type.name !== 'shadow')
                .map((type) => (
                  <TypeList
                    key={type.name}
                    type={type.name}
                    typeColor={typeColorMap[type.name] || 'bg-white'}
                    pokemons={pokemons}
                    setSearchQuery={setSearchQuery}
                    setSearchedPokemons={setSearchedPokemons}
                  />
              ))}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-lime-600 font-bold text-2xl text-center mb-2">Leitaðu í gagnagrunni</h2>
              <form className="flex relative gap-4 w-5/12 m-auto mb-10 border-2 border-zinc-100 rounded-3xl"
                onSubmit={(e) => e.preventDefault()}>
                <button type="submit" className="w-5 absolute top-1/4 left-3"><img src={searchIcon} alt="" /></button>
                <input type="search" className="flex w-full pl-12 p-3 rounded-3xl" name='query' value={searchQuery} placeholder='sláðu inn leitarorð...'
                  onChange={handleInputChange}></input>
              </form>
              {loading ? (
                <Loading />
              ) : ( 
                <div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-11/12 mx-auto mb-8 max-w-7xl">
                {searchedPokemons
                  .slice(0, totalPokemonCount)
                  .map((pokemon) => (
                    <Pokemon
                    key={pokemon.index}
                    img={pokemon.img}
                    index={pokemon.index}
                    name={pokemon.name}
                    type={pokemon.type}
                    secondary={pokemon.secondary}
                    typeColor={pokemon.typeColor}
                    secondaryColor={pokemon.secondaryColor}
                    />
                  ))}
                  </div>
                  {showTypes ? (
                    <div className="flex flex-cols justify-center gap-2 mb-2">
                    {renderPageNumbers()}
                  </div>
                  ) : (
                    ''
                  )}
                </div>
              )}
            </div>
          )}
        </main>
        <footer className="bg-red-100 px-12">
          <p className="text-center text-red-300 border-t border-red-400 pt-3 mt-16 mb-10">Gögn sótt af PokéAPI: https://pokeapi.co/api/v2/</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
