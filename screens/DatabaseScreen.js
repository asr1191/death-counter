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

// Optimization 
const MemoizedRenderItem = React.memo(BossRenderItem)
const MemoizedHiddenRenderItem = React.memo(BossHiddenRenderItem)
const MemoizedSwipeListView = React.memo(SwipeListView)
const deathCountImage = require('../assets/floral-death-background.png')


function _newLineAtComma(name) {
    let newName = name

    let index = name.indexOf(',')
    if (index >= 0) {
        newName = name.slice(0, index + 1) + '\n' + name.slice(index + 2)
    }

    index = name.indexOf('(')
    if (index >= 0) {
        newName = newName.slice(0, index - 1) + '\n' + newName.slice(index)
    }

    return newName
}


export default function DatabaseScreen(props) {

    // const [filteredBosses, setFilteredBosses] = useState([])
    const [hiddenRowButtonWidth, setHiddenRowButtonWidth] = useState(0);
    // const [searchInputText, setSearchInputText] = useState('')

    const [mmkvBossesList, setMMKVBossesList] = useMMKVObject('bosses_list')
    const [getNewId, setNewId] = useMMKVNumber('latest_id')

    const bossesSwipeListRef = useRef(null)


    // Fetch initial data
    useEffect(() => {
        const fetchedAllBossesData = require('../data/MOCK_DATA.json').data
        setMMKVBossesList(fetchedAllBossesData)
        // setFilteredBosses(fetchedAllBossesData)
    }, [])

    // Hide SplashScreen
    // useEffect(() => {
    //     SplashScreen.hideAsync()
    // }, [mmkvBossesList])

    // Filter results
    // useEffect(() => {
    //     if (props.navigation.isFocused()) {
    //         let newItems = filter(mmkvBossesList, (item) => {
    //             let itemText = item.title.toLowerCase();
    //             return itemText.includes(searchInputText.toLowerCase())
    //         })
    //         setFilteredBosses(newItems)
    //     } else {
    //         console.log('ROUTE: %s', props.navigation.isFocused());
    //         setFilteredBosses(mmkvBossesList)
    //     }
    // }, [searchInputText, mmkvBossesList])

    // On every Render
    useEffect(() => {
        console.log('<========NEW RENDER (DATABASE SCREEN)========>');
    })

    const onTouchHandlerItem = useCallback((item) => {
        if (item != mmkvBossesList[0]) {
            let newBossesList = mmkvBossesList
            newBossesList.unshift(newBossesList.splice(newBossesList.indexOf(item), 1)[0])
            setMMKVBossesList(newBossesList);
            bossesSwipeListRef.current.scrollToIndex({
                index: 0
            })
        }
        props.navigation.navigate('D E A T H S')
    }, [mmkvBossesList])

    const renderItem = useCallback((obj, rowMap) => {
        return <BossRenderItem
            item={obj.item}
            deathCountImage={deathCountImage}
            onTouchHandler={onTouchHandlerItem}
            itemText={_newLineAtComma(obj.item.title)}
        />
    }, [onTouchHandlerItem])


    const renderHiddenItem = useCallback((data, rowMap) => (
        <BossHiddenRenderItem
            data={data}
            rowMap={rowMap}
            mmkvBossesList={mmkvBossesList}
            setMMKVBossesList={setMMKVBossesList}
            setHiddenRowButtonWidth={setHiddenRowButtonWidth}
            hiddenRowButtonWidth={hiddenRowButtonWidth}
        />

    ), [mmkvBossesList, hiddenRowButtonWidth])

    // const onRowDidOpen = rowKey => {
    //     console.log('This row opened', rowKey);
    // };

    const addBossHandler = () => {
        if (searchInputText.length > 0) {
            let newList = []
            if (mmkvBossesList != undefined)
                newList = mmkvBossesList
            const newBoss = {
                key: getNewId,
                title: searchInputText,
                deaths: 0
            }
            newList.splice(0, 0, newBoss)
            setMMKVBossesList(newList)
            setNewId(getNewId + 1)
            Keyboard.dismiss()
        }
    }


    return (
        <SearchBosses
            bossesSwipeListRef={bossesSwipeListRef}
            mmkvBossesList={mmkvBossesList}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            hiddenRowButtonWidth={hiddenRowButtonWidth}
            // onRowDidOpen={onRowDidOpen}
            addBossHandler={addBossHandler}
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
