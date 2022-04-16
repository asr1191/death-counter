import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    ImageBackground,
    TouchableOpacity,
    TouchableNativeFeedback,
    Keyboard
} from 'react-native';
import filter from 'lodash.filter';
import remove from 'lodash.remove';
import * as SplashScreen from 'expo-splash-screen';

import { SwipeListView } from 'react-native-swipe-list-view';
import { useMMKVNumber, useMMKVObject } from 'react-native-mmkv';

import BossRenderItem from '../components/BossRenderItem';
import BossHiddenRenderItem from '../components/BossHiddenRenderItem';
import SearchBosses from '../components/SearchBosses';
import useDBObject from '../hooks/useDBObject';

// Optimization 
const MemoizedRenderItem = React.memo(BossRenderItem)
const MemoizedHiddenRenderItem = React.memo(BossHiddenRenderItem)
const MemoizedSwipeListView = React.memo(SwipeListView)


export default function DatabaseScreen(props) {


    const [mmkvBossesList, setMMKVBossesList] = useDBObject('bosses_list2')

    const bossesSwipeListRef = useRef(null)


    // Fetch initial data
    useEffect(() => {
        // const fetchedAllBossesData = require('../data/MOCK_DATA.json').data
        // setMMKVBossesList(fetchedAllBossesData)
        // setFilteredBosses(fetchedAllBossesData)
    }, [])

    // On every Render
    useEffect(() => {
        console.log('<========NEW RENDER (DATABASE SCREEN)========>');
    })

    // const onRowDidOpen = rowKey => {
    //     console.log('This row opened', rowKey);
    // };

    return (
        <SearchBosses
            bossesSwipeListRef={bossesSwipeListRef}
            navigation={props.navigation}
        // hiddenRowButtonWidth={hiddenRowButtonWidth}
        // onRowDidOpen={onRowDidOpen}
        />

    );
}

const styles = StyleSheet.create({
    searchBox: {
        flex: 1,
        backgroundColor: '#3B352B',
        // marginVertical: 30,
        // width: '100%',
        fontSize: 20,
        fontFamily: 'RomanAntique',
        color: 'rgb(243,211,158)',
        borderRadius: 5,
        padding: 5,
        paddingHorizontal: 10
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'rgba(47, 42, 35, 1)',
        backgroundColor: 'rgb(59, 53, 43)',

        borderRadius: 15,
        // paddingVertical: 20,
        marginBottom: 10,
    },
    list: {
        width: '95%',
        marginBottom: 10
    },
    itemText: {
        fontSize: 20,
        color: 'rgb(243, 211, 158)',
        fontFamily: 'OptimusPrinceps',
        // textDecorationLine: 'line-through'
    },
    deathCount: {
        fontSize: 40,
        color: 'rgb(243, 211, 158)',
        // color: '#BB8D43',
        fontFamily: 'OptimusPrinceps',
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: 'rgba(243, 211, 158, 1)',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // paddingLeft: 15,
        borderRadius: 16,
        // paddingVertical: 20,
        marginBottom: 11
    },
    backBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
})
