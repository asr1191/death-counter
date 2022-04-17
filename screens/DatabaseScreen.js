import React, { useRef, useEffect } from 'react'
import SearchBosses from '../components/SearchBosses';

export default function DatabaseScreen(props) {


    useEffect(() => {
        console.log('<========NEW RENDER (DATABASE SCREEN)========>');
    })

    return (
        <SearchBosses
            navigation={props.navigation}
        />

    );
}
