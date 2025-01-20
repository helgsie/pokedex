import React from "react";
import PropTypes from 'prop-types';

function Pokemon(props) {

    return (
        <div className="bg-zinc-100 p-5 rounded-2xl">
            <div className="grid gap-1/2">
                <img className="w-40 sm:w-full m-auto" src={props.img} alt={props.name}/>
                <p className="text-zinc-500 text-center text-sm">#{props.index}</p>
                <div className="flex gap-1 place-items-center justify-center">
                    <h3 className="font-medium text-zinc-900 text-lg text-center">{props.name}</h3>
                </div>
                <div className="flex flex-row justify-center text-sm place-items-center mt-1">
                    <p className={`rounded-xl py-1 px-2 text-center font-medium text-white ${props.typeColor}`}>{ props.type ? props.type : '' }</p>
                    <p className={`rounded-xl py-1 px-2 ml-1 text-center font-medium text-white ${props.secondaryColor} ${props.secondary ? '' : 'hidden'}`}>{props.secondary}</p>
                </div>
            </div>
        </div>
    )
}

Pokemon.propTypes = {
    img: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    secondary: PropTypes.string,
    typeColor: PropTypes.string.isRequired,
    secondaryColor: PropTypes.string
}

export default Pokemon;