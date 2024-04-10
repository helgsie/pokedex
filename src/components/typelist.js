import React from 'react';
import PropTypes from 'prop-types';

function TypeList(props) {

    return (
        <p className={`${props.typeColor} py-12 rounded-3xl text-center text-xl text-white`}>
            {props.type}
        </p>
    )
}

TypeList.propTypes = {
    type: PropTypes.string.isRequired,
    typeColor: PropTypes.string.isRequired
}

export default TypeList;