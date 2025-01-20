import React from 'react';
import Pokemon from './pokemon';
import PropTypes from 'prop-types';

const PokemonList = React.memo(({ pokemons }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-11/12 mx-auto mb-8 max-w-7xl">
      {pokemons.map((pokemon) => (
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
));
    
PokemonList.propTypes = {
    pokemons: PropTypes.arrayOf(
        PropTypes.shape({
            img: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            index: PropTypes.number.isRequired,
            type: PropTypes.string.isRequired,
            secondary: PropTypes.string,
            typeColor: PropTypes.string.isRequired,
            secondaryColor: PropTypes.string,
        })
    ).isRequired,        
};

  PokemonList.displayName = 'PokemonList';

export default PokemonList;