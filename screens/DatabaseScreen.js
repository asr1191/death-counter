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

import filter from 'lodash.filter';
import remove from 'lodash.remove';

import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Context } from '../contexts/CurrentBossContext';
import { useMMKVObject } from 'react-native-mmkv';

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
        setAllBosses(fetchedAllBossesData)
        setFilteredBosses(fetchedAllBossesData)
    }, [])

    // Hide SplashScreen
    useEffect(() => {
        console.log(mmkvBossesList);
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
        console.log('NEW RENDER');
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

    const renderItem = ({ item }) =>
    (
        <TouchableNativeFeedback onPress={() => {
            handleItemTouch(item)
        }}>
            <View style={styles.item}>
                <View style={{
                    justifyContent: 'center',
                    flex: 3,
                    marginLeft: 20

                }}>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        marginVertical: 20

                    }}>
                        <Text style={styles.itemText}>{_newLineAtComma(item.title)}</Text>
                    </View>
                </View>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderLeftWidth: 1,
                    borderLeftColor: 'rgba(243, 211, 158, 0.1)',
                    marginVertical: 20,
                }}>
                    <ImageBackground
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            // marginVertical: 20
                            // overflow: 'hidden'

                        }}
                        imageStyle={{
                            opacity: 0.1,
                            // width: '100%',
                            transform: [{
                                scale: 1.5
                            }]
                        }}
                        source={require('../assets/floral-death-background.png')}
                        resizeMode={'contain'}
                    >
                        <View style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            // paddingVertical: 20
                        }}>
                            <Text style={styles.deathCount}>{item.deaths}</Text>
                        </View>
                    </ImageBackground>
                </View>
            </View>
        </TouchableNativeFeedback>

    )

    const closeRow = (rowMap, key) => {
        rowMap[key].closeRow()
    }

    const deleteRow = (rowMap, key) => {
        const newBosses = [...allBosses]
        remove(newBosses, (boss) => {
            if (key == boss.key) {
                console.log('Deleting item with key (%s)', boss.key);
                return true
            } else {
                return false
            }
        })
        // console.log(newBosses);
        setAllBosses(newBosses)
    }

    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={[styles.backBtn, styles.backRightBtnLeft]}
                onPress={() => closeRow(rowMap, data.item.key)}
                onLayout={(event) => {
                    setHiddenRowButtonWidth(event.nativeEvent.layout.width)
                }}
            >
                <MaterialCommunityIcons
                    name="sword-cross"
                    size={35}
                    color='rgba(47, 42, 35, 1)'
                    style={{
                        margin: 20
                    }}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.backBtn, styles.backRightBtnRight]}
                onPress={() => deleteRow(rowMap, data.item.key)}
            >
                <MaterialCommunityIcons
                    name="delete-outline"
                    size={35}
                    color='rgba(47, 42, 35, 1)'
                    style={{
                        margin: 20
                    }}
                />
            </TouchableOpacity>
        </View>
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
