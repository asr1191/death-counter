import React, { useState, useRef, useEffect, useContext } from 'react'
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
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useMMKVNumber, useMMKVObject } from 'react-native-mmkv';

import BossRenderItem from '../components/BossRenderItem';
import BossHiddenRenderItem from '../components/BossHiddenRenderItem';

// Optimization 
const MemoizedRenderItem = React.memo(BossRenderItem)
const MemoizedHiddenRenderItem = React.memo(BossHiddenRenderItem)
const deathCountImage = require('../assets/floral-death-background.png')

export default function DatabaseScreen(props) {

    const [filteredBosses, setFilteredBosses] = useState([])
    const [hiddenRowButtonWidth, setHiddenRowButtonWidth] = useState(0);
    const [searchInputText, setSearchInputText] = useState('')

    const [mmkvBossesList, setMMKVBossesList] = useMMKVObject('bosses_list')
    const [getNewId, setNewId] = useMMKVNumber('latest_id')

    const searchInputRef = useRef(null)
    const bossesSwipeListRef = useRef(null)


    // Fetch initial data
    // useEffect(() => {
    // const fetchedAllBossesData = require('../data/bosses.json').data
    // setMMKVBossesList(fetchedAllBossesData)
    // setFilteredBosses(fetchedAllBossesData)
    // }, [])

    // Hide SplashScreen
    useEffect(() => {
        SplashScreen.hideAsync()
    }, [mmkvBossesList])

    // Filter results
    useEffect(() => {
        let newItems = filter(mmkvBossesList, (item) => {
            let itemText = item.title.toLowerCase();
            return itemText.includes(searchInputText.toLowerCase())
        })
        setFilteredBosses(newItems)
    }, [searchInputText, mmkvBossesList])

    // On every Render
    useEffect(() => {
        console.log('<========NEW RENDER (DATABASE SCREEN)========>');
    })

    const handleSearch = (queryText) => {
        setSearchInputText(queryText)
    }

    const renderItem = (obj, rowMap) => (
        <MemoizedRenderItem
            item={obj.item}
            rowMap={rowMap}
            navigation={props.navigation}
            deathCountImage={deathCountImage}
            mmkvBossesList={mmkvBossesList}
            setMMKVBossesList={setMMKVBossesList}
            bossesListRef={bossesSwipeListRef}
        />
    )

    const renderHiddenItem = (data, rowMap) => (
        <MemoizedHiddenRenderItem
            data={data}
            rowMap={rowMap}
            mmkvBossesList={mmkvBossesList}
            setMMKVBossesList={setMMKVBossesList}
            setHiddenRowButtonWidth={setHiddenRowButtonWidth}
            hiddenRowButtonWidth={hiddenRowButtonWidth}
        />

    );

    const onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);
    };

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
            setSearchInputText('')
            setNewId(getNewId + 1)
            Keyboard.dismiss()
        }
    }


    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <View style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                paddingVertical: 20,
                marginBottom: 20,
                // marginHorizontal: 20,
                paddingHorizontal: 10,
                borderBottomColor: 'rgba(243, 211, 158, 0.2)',
                borderBottomWidth: 1,
                // borderRadius: 20
            }}>
                <TextInput
                    listViewRef={bossesSwipeListRef}
                    autoCapitalize={'sentences'}
                    autoCorrect={false}
                    value={searchInputText}
                    onChangeText={handleSearch}
                    placeholder={"Search or add bosses..."}
                    style={styles.searchBox}
                />
                <TouchableOpacity
                    style={{

                    }}
                    onPress={addBossHandler}
                >
                    <View style={{
                        borderRadius: 5,
                        marginLeft: 10,
                        width: 50,
                        backgroundColor: 'rgba(243, 211, 158, 1)',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'

                        // height: '100%',
                    }}>
                        <MaterialIcons name="add" size={35} color="rgba(47, 42, 35, 1)" />

                    </View>

                </TouchableOpacity>
            </View>
            <SwipeListView
                listViewRef={bossesSwipeListRef}
                style={styles.list}
                data={filteredBosses}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                showsVerticalScrollIndicator={false}
                fadingEdgeLength={50}
                overScrollMode={'never'}
                leftOpenValue={hiddenRowButtonWidth}
                rightOpenValue={-hiddenRowButtonWidth}
                stopLeftSwipe={hiddenRowButtonWidth * 1.5}
                stopRightSwipe={-hiddenRowButtonWidth * 1.5}
                previewRowKey={'2'}
                previewOpenValue={-40}
                // previewRepeat={true}
                // previewDuration={500}
                // previewRepeatDelay={500}
                previewOpenDelay={1000}
                onRowDidOpen={onRowDidOpen}
                friction={600}
                tension={500}
                recalculateHiddenLayout={true}
                extraData={mmkvBossesList}
            />
        </View>
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
