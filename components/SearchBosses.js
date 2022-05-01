import React, { useCallback, useEffect, useState, useRef, useContext } from 'react'
import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Keyboard,
    ToastAndroid,
    Image,
    Text,
    ImageBackground,
    Pressable,
    Vibration
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import filter from 'lodash.filter';
import { MaterialIcons } from '@expo/vector-icons';
import { useMMKVNumber } from 'react-native-mmkv';

import BossRenderItem from './BossRenderItem';
import BossHiddenRenderItem from './BossHiddenRenderItem';
import { BossContext } from '../contexts/BossContext';
import { AdMobBanner, setTestDeviceIDAsync } from 'expo-ads-admob';

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
const deathCountImage = require('../assets/floral-death-background.png')
const footerImage = require('../assets/floral-boss-list-footer2.png')

export default function SearchBosses({ navigation }) {

    const bossesSwipeListRef = useRef(null)
    const [searchInputText, setSearchInputText] = useState('')
    const { getDBObj, setDBObj, setPreviewBoss } = useContext(BossContext)
    const [getNewId, setNewId] = useMMKVNumber('latest_id')
    const [isFreeUser, setUserPrivilege] = useState(true)

    useEffect(() => {
        setTestDeviceIDAsync("EMULATOR");
    }, [])

    useEffect(() => {
        console.log('BOSSES-LIST: Next ID to be inserted (%d)', getNewId);
    }, [getNewId])

    const getSearchResults = useCallback(() => {
        let filteredBosses = filter(getDBObj, (item) => {
            let itemText = item.title.toLowerCase()
            return itemText.includes(searchInputText.toLowerCase())
        })
        return filteredBosses
    }, [getDBObj, searchInputText])

    const removeAdsHandler = useCallback(() => {
        Vibration.vibrate(100, false)
    }, [])

    const addBossHandler = () => {
        setDBObj((prevMMKVBossesList) => {
            if (prevMMKVBossesList != undefined && prevMMKVBossesList.length >= 150) {
                console.log('BOSSES-LIST: Boss cannot be added! Maximum capacity reached!');
                ToastAndroid.show('Boss cannot be added! Maximum capacity reached!', ToastAndroid.LONG)
                return prevMMKVBossesList
            }
            if (searchInputText.length > 0) {
                let newList = []
                if (prevMMKVBossesList != undefined)
                    newList = [...prevMMKVBossesList]
                const newBoss = {
                    key: getNewId.toString(),
                    title: searchInputText.trim(),
                    deaths: 0
                }
                newList.splice(0, 0, newBoss)
                Keyboard.dismiss()

                setNewId(getNewId + 1)

                console.log('BOSSESLIST: Setting preview boss. %s', newBoss)
                setPreviewBoss(newBoss)

                console.log('BOSSESLIST: Added new boss. %s', newList.slice(0, 3));
                return newList
            }
        })
        setSearchInputText('')
    }

    const listFooterComponent = useCallback(() => (
        <View style={styles.alignCenter}>
            <Image
                source={footerImage}
                resizeMode={'contain'}
                style={styles.footerImage}
            />
        </View>
    ))

    const renderItem = (obj, rowMap) => {
        return <BossRenderItem
            item={obj.item}
            rowMap={rowMap}
            deathCountImage={deathCountImage}
            setMMKVBossesList={setDBObj}
            setPreviewBoss={setPreviewBoss}
            itemText={_newLineAtComma(obj.item.title)}
            navigation={navigation}
        />
    }


    const renderHiddenItem = (data, rowMap) => (
        <BossHiddenRenderItem
            data={data}
            rowMap={rowMap}
            setDBObj={setDBObj}
            setPreviewBoss={setPreviewBoss}
        //     hiddenRowButtonWidth={hiddenRowButtonWidth}
        />

    )

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    autoCapitalize={'words'}
                    autoCorrect={false}
                    value={searchInputText}
                    onChangeText={setSearchInputText}
                    placeholder={"Add or Search your bosses..."}
                    style={styles.searchBox}
                    returnKeyType={'search'}
                    selectionColor={'rgba(243, 211, 158, 0.4)'}
                    maxLength={50}
                />
                <TouchableOpacity
                    onPress={addBossHandler}
                >
                    <View style={styles.button}>
                        <MaterialIcons name="add" size={35} color="rgba(47, 42, 35, 1)" />
                    </View>
                </TouchableOpacity>
            </View>
            <SwipeListView
                listViewRef={bossesSwipeListRef}
                style={styles.list}
                data={getSearchResults()}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                ListFooterComponent={listFooterComponent}
                showsVerticalScrollIndicator={false}
                fadingEdgeLength={50}
                overScrollMode={'never'}
                leftOpenValue={75}
                rightOpenValue={-75}
                stopLeftSwipe={75 * 1.5}
                stopRightSwipe={-75 * 1.5}
                previewRowKey={(getNewId - 1).toString()}
                previewOpenValue={-40}
                // previewRepeat={true}
                // previewDuration={2000}
                // previewRepeatDelay={500}
                previewOpenDelay={250}
                // onRowDidOpen={onRowDidOpen}
                friction={600}
                tension={500}
                disableRightSwipe={true}
            />
            {isFreeUser && <View style={[styles.alignCenter, { width: '100%' }]}>
                <Pressable onPress={removeAdsHandler} style={[styles.contributeContainer, styles.alignCenter]}>
                    <ImageBackground
                        style={{
                            // width: '100%',
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        imageStyle={{
                            justifyContent: 'center',
                            alignItems: 'center'
                            // opacity: 0.8
                            // height: '100%',
                        }}
                        resizeMode={'stretch'}
                        source={require('../assets/count-glow-2.png')}
                    >
                        <Text style={styles.contribute}>CONTRIBUTE / REMOVE ADS</Text>
                    </ImageBackground>
                </Pressable>
                <AdMobBanner
                    bannerSize='banner'
                    adUnitID='ca-app-pub-3940256099942544/6300978111'
                    servePersonalizedAds // true or false
                    onDidFailToReceiveAdWithError={(e) => console.log(e)}
                />
            </View>}

        </View>
    )
}

const styles = StyleSheet.create({
    alignCenter: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerImage: {
        height: 60,
        opacity: 0.8
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchContainer: {
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
    },
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
    button: {
        borderRadius: 5,
        marginLeft: 10,
        width: 50,
        backgroundColor: 'rgba(243, 211, 158, 1)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
        // height: '100%',
    },
    list: {
        width: '95%',
        marginBottom: 15
    },
    contribute: {
        fontFamily: 'RomanAntique',
        color: 'rgb(243,211,158)',
        textShadowColor: 'rgb(243,211,158)',
        textShadowRadius: 15
    },
    contributeContainer: {
        marginBottom: 15,
        width: '100%'
    }
})