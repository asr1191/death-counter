import React, { useState, useRef, useEffect, useContext } from 'react'

import {
    Text,
    View,
    StyleSheet,
    TextInput,
    ImageBackground,
    TouchableOpacity,
    TouchableNativeFeedback
} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

import filter from 'lodash.filter';
import remove from 'lodash.remove';

import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Context } from '../contexts/CurrentBossContext';
import { useMMKVObject } from 'react-native-mmkv';
import BossListItem from '../components/BossListItem';
import BossHiddenListItem from '../components/BossHiddenListItem';

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
const MemoizedRenderItem = React.memo(BossListItem)
const MemoizedHiddenRenderItem = React.memo(BossHiddenListItem)
const deathCountImage = require('../assets/floral-death-background.png')

export default function DatabaseScreen(props) {

    const [filteredBosses, setFilteredBosses] = useState([])
    const [allBosses, setAllBosses] = useState([])
    const [hiddenRowButtonWidth, setHiddenRowButtonWidth] = useState(0);
    const [searchInputText, setSearchInputText] = useState('')

    const [mmkvBossesList, setMMKVBossesList] = useMMKVObject('bosses_list')

    const { setCurrentBossWrapper } = useContext(Context)

    const searchInput = useRef(null)


    // Fetch initial data
    useEffect(() => {
        // setItems(_initItemArray(MAX_DEATH))
        const fetchedAllBossesData = require('../data/bosses.json').data
        setMMKVBossesList(fetchedAllBossesData)

        setAllBosses(fetchedAllBossesData)
        setFilteredBosses(fetchedAllBossesData)
    }, [])

    // Hide SplashScreen
    useEffect(() => {
        // console.log('MMKV: Bosses list: %s', mmkvBossesList);
        // if (mmkvBossesList.)
        SplashScreen.hideAsync()
    }, [mmkvBossesList])

    // Filter results
    useEffect(() => {
        let newItems = filter(allBosses, (item) => {
            let itemText = item.title.toLowerCase();
            return itemText.includes(searchInputText.toLowerCase())
        })
        setFilteredBosses(newItems)
    }, [searchInputText, allBosses])

    // On every Render
    useEffect(() => {
        console.log('<========NEW RENDER========>');
    })

    const handleSearch = (queryText) => {
        setSearchInputText(queryText)
    }

    const handleItemTouch = (item) => {
        const setBoss = (item) => {
            setCurrentBossWrapper(item.title, item.deaths)
        }
        props.navigation.navigate('D E A T H S')
        setTimeout(() => { setBoss(item) }, 0)
        // setBoss(item)
    }

    const renderItem = (obj) => (
        <MemoizedRenderItem
            item={obj.item}
            setCurrentBossWrapper={setCurrentBossWrapper}
            navigation={props.navigation}
            deathCountImage={deathCountImage}
        />
    )

    const renderHiddenItem = (data, rowMap) => (
        <MemoizedHiddenRenderItem
            data={data}
            rowMap={rowMap}
            allBosses={allBosses}
            setAllBosses={setAllBosses}
            setHiddenRowButtonWidth={setHiddenRowButtonWidth}
            hiddenRowButtonWidth={hiddenRowButtonWidth}
        />

    );

    const onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);
    };


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
                    ref={searchInput}
                    autoCapitalize={'sentences'}
                    autoCorrect={false}
                    value={searchInputText}
                    onChangeText={handleSearch}
                    placeholder={"Search or add bosses..."}
                    style={styles.searchBox}
                />
                <TouchableOpacity style={{
                }}>
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
                extraData={allBosses}
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
