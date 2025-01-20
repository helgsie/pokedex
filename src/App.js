import './index.css';
import React, { useState, useEffect } from 'react';
import Pokemon from './components/pokemon';
import TypeList from './components/typelist';
import searchIcon from './search-interface-symbol.png';
import Loading from './components/Loading';
import PokemonList from './components/PokemonList';

function App() {
  const limitPerPage = 40;
  //const scrollContainerRef = useRef(null);

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
  const [loading, setLoading] = useState(false);
  const [showResults,setShowResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTypes, setShowTypes] = useState(false);
  const [types, setTypes] = useState([]);
  const [totalPokemonCount, setTotalPokemonCount] = useState(0);
  const [allPokemons, setAllPokemons] = useState([]);
  const [pokedex, setShowPokedex] = useState(false);
  //const [scrollPosition, setScrollPosition] = useState(0);
  /*const totalPageCount = Math.ceil(searchedPokemons.length / limitPerPage);*/

  const renderPageNumbers = () => {
    const pageNumbers = [];

    pageNumbers.push(
    <button
      key='previous'
      className='mx-6'
      onClick={() => setCurrentPage(currentPage - 1)}
      hidden={currentPage === 1}
    >← Fyrri
    </button>
    );

    const totalPageCount = Math.ceil(searchedPokemons.length / limitPerPage);

    for (let i = 1; i <= totalPageCount; i++) {
      if (
        i === 1 ||
        i === currentPage - 2 ||
        i === currentPage - 1 ||
        i === currentPage ||
        i === currentPage + 1 ||
        i === currentPage + 2 ||
        i === totalPageCount
      ) {
        pageNumbers.push(
          <button
          key={i}
          className={`px-3 py-1 ${
            i === currentPage ? 'bg-lime-500 text-white rounded-full' : 'bg-white'
          }`}
          onClick={() => setCurrentPage(i)}>
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
      else if (i === totalPageCount-1 && currentPage < totalPageCount-3) {
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
        hidden={currentPage === totalPageCount}
      >Næsta →
      </button>
      );

    return pageNumbers;
  };
  
  useEffect(() => {
    const fetchBasicPokemonData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1010`);
        if (!response.ok) throw new Error('Failed to fetch Pokémon list');
  
        const basicData = await response.json();
        setAllPokemons(basicData.results); // Store basic data only (name and URL)

        const totalCount = basicData.count;
        setTotalPokemonCount(totalCount);
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBasicPokemonData();
  }, []);

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
        setShowResults(false);
      }

      const fetchSearchedPokemons = async () => {
        const searched = await Promise.all(
          allPokemons
            .filter((pokemon) =>
              pokemon.name.toLowerCase().startsWith(searchQuery.toLowerCase())
            )
            .map(async (pokemon) => {
              const detailResponse = await fetch(pokemon.url);
              if (!detailResponse.ok) throw new Error('Failed to fetch Pokémon details');
              const detailData = await detailResponse.json();
    
              const imageContent = detailData.sprites.other['official-artwork'].front_default || detailData.sprites.front_default;
              const types = detailData.types.map((type) => type.type.name);
    
              return {
                img: imageContent,
                index: detailData.id,
                name: pokemon.name.replace(/-/g, ' '),
                type: types[0],
                secondary: types[1] || null,
                typeColor: typeColorMap[types[0]] || 'bg-white',
                secondaryColor: types[1] ? typeColorMap[types[1]] : 'bg-white',
              };
            })
        );

      setSearchedPokemons(searched);
      setShowResults(true);
      };

      fetchSearchedPokemons();
  
  }, [searchQuery, allPokemons]);
  
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  } 

  const paginatedPokemons = searchedPokemons.slice(
    (currentPage - 1) * limitPerPage,
    currentPage * limitPerPage
  );

  // HTML-ið sem á að birtast á vefsíðunni
  return (
    <div className="App">
      <div className="flex flex-col gap-4 h-full min-h-full">
        <header className="flex justify-between items-center w-11/12 m-auto max-w-7xl prose">
          <a href="/"><h1 className="text-red-400 mb-0 w-80 sm:w-full">Pokémon gagnagrunnur</h1></a>
          <div className="">
            <li className="flex gap-5 place-items-center">
              <a href="/" className="not-prose" onClick={(e) => {e.preventDefault(); setShowPokedex(true); }}><ul className="px-3 py-1 border-2 border-red-400 hover:bg-red-400 transition ease-in-out rounded-3xl">Pokédex</ul></a>
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
              <form className="flex relative gap-4 w-5/12 m-auto border-2 border-zinc-100 rounded-3xl"
                onSubmit={(e) => e.preventDefault()}>
                <button type="submit" className="w-5 absolute top-1/4 left-3"><img src={searchIcon} alt="" /></button>
                <input type="search" className="flex w-full pl-12 p-3 rounded-3xl" name='query' value={searchQuery} placeholder='sláðu inn leitarorð...'
                  onChange={handleInputChange}></input>
              </form>
              <div className="pt-6 pb-10">
                {loading && showResults ? (
                  <Loading />
                ) : ( 
                  <div>
                    <PokemonList pokemons={paginatedPokemons} />
                    {showResults && searchedPokemons.length > 0 ? (
                      <div className="flex flex-cols justify-center gap-2 mb-2">
                      {renderPageNumbers()}
                      </div>
                    ) : (
                      showResults && searchedPokemons.length === 0 && (
                        <p className="text-center text-slate-700">Engar niðurstöður fyrir þennan leitarstreng.</p>
                      )
                    )}
                  </div>
                )}
              </div>
              
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
