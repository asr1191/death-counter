import React, { useEffect, useState, useRef, useContext } from 'react'
import {
    Text,
    View,
    StyleSheet,
    FlatList,
    Pressable,
    Dimensions,
    Image,
    ImageBackground,

} from 'react-native';

import { useKeepAwake } from 'expo-keep-awake';

import { Context } from '../contexts/CurrentBossContext';

import { useMMKVObject } from 'react-native-mmkv';

const MAX_DEATH = 501

function _initItemArray(maxNumber) {
    items = [];
    for (let index = 0; index < maxNumber; index++) {
        items.push({
            id: index,
            title: (index).toString()
        })
    }
    return items;
}

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

let scrollPosition = -1

export default function CounterScreen(props) {

    const [items, setItems] = useState(_initItemArray(MAX_DEATH))
    const [height, setHeight] = useState(-1)
    const [canMomentum, setCanMomentum] = useState(false);

    const { currentBoss: { count, name }, setCurrentBossWrapper } = useContext(Context);
    const [mmkvBossesList, setMMKVBossesList] = useMMKVObject('bosses_list')

    const counterRef = useRef(null)

    useKeepAwake();

    //Run once after mounting
    useEffect(() => {
        if (height != -1 && mmkvBossesList != undefined && mmkvBossesList.length != 0) {
            try {
                counterRef.current.scrollToIndex({
                    index: mmkvBossesList[0].deaths
                })
            } catch (e) {
                console.warn('COUNTERREF ERRORO LMAO');
            }
        }
    },
        [height]
    )


    useEffect(() => {
        console.log('<========NEW RENDER (COUNTER SCREEN)========>');
    })

    useEffect(() => {
        if (mmkvBossesList != undefined && mmkvBossesList.length != 0) {
            console.log('COUNTER: scrollPosition (%d), count (%d)', scrollPosition, mmkvBossesList[0].deaths);
            if (scrollPosition != mmkvBossesList[0].deaths && counterRef.current != null) {
                console.log('COUNTER: scrollPosition different from parent state! (%d, %d). Scrolling to %d', scrollPosition, mmkvBossesList[0].deaths, mmkvBossesList[0].deaths);
                try {
                    counterRef.current.scrollToIndex({
                        index: mmkvBossesList[0].deaths
                    })
                } catch (e) {
                    console.warn('COUNTERREF ERRORO LMAO');
                }
                scrollPosition = mmkvBossesList[0].deaths
                console.log('NAVIGATOR: Navigating to DeathsScreen');
            }
        } else {
            console.log('COUNTER: Resetting to zero');
            try {
                counterRef.current.scrollToIndex({
                    index: 0
                })
            } catch (e) {
                console.warn('COUNTERREF ERRORO LMAO');
            }
        }
    }, [mmkvBossesList])


    const _incrementCounter = () => {
        if (mmkvBossesList != undefined && mmkvBossesList.length != 0) {
            let newList = mmkvBossesList
            if (newList[0].deaths + 1 < MAX_DEATH && counterRef.current != null) {
                console.log('COUNTER: Incrementing to %d', newList[0].deaths + 1);

                const newBoss = {
                    key: newList[0].key,
                    title: newList[0].title,
                    deaths: newList[0].deaths + 1
                }

                newList.splice(0, 1, newBoss)
                setMMKVBossesList(newList)
            }
        }
    }

    // List Items 
    const renderItem = ({ item }) =>
    (
        <Pressable onPress={_incrementCounter}>
            <View
                onLayout={(event) => {
                    if (height < 0) {
                        setHeight(event.nativeEvent.layout.height)
                    }
                }}
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%'
                }}
            >
                <Text style={styles.count} adjustsFontSizeToFit allowFontScaling={false} >{item.title}</Text>
            </View>
        </Pressable>
    )


    const onScrollFn = () => {
        setCanMomentum(true)
    }

    const onMomentumScrollEndFn = (event) => {
        if (canMomentum) {
            let floored = Math.floor(Math.floor(event.nativeEvent.contentOffset.y) / Math.floor(height))
            scrollPosition = floored;
            console.log('COUNTER: Set scrollPosition (%d)', floored);

            let newList = mmkvBossesList
            const newBoss = {
                key: newList[0].key,
                title: newList[0].title,
                deaths: floored
            }
            newList.splice(0, 1, newBoss)
            setMMKVBossesList(newList)
        }
        setCanMomentum(false)
    }

    const getItemLayoutFn = (data, index) => ({ length: height, offset: height * index, index })

    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',

        }}>
            <View style={{
                height: 100
            }}>
                {/* flexboooooxxx */}
            </View>

            <View style={{
                alignItems: 'center',
                width: '100%',
                justifyContent: 'space-between',
                // marginTop: ??
            }}>
                <View>{/* flexboxxx */}</View>
                <ImageBackground
                    style={styles.ringImageBgComponent}
                    source={require('../assets/elden-ring-transparent-edge.png')}
                    resizeMode={'contain'}
                    imageStyle={styles.ringImageBgStyle}
                    blurRadius={3}
                >

                    <View style={{
                        // flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        // width: '100%'
                    }}>
                        <ImageBackground
                            style={{
                                // width: '100%',
                            }}
                            imageStyle={{
                                // height: '100%',
                                opacity: 0.8
                            }}
                            resizeMode={'center'}
                            source={require('../assets/count-glow-2.png')}
                        >

                            <FlatList
                                ref={counterRef}
                                initialScrollIndex={count}
                                style={{
                                    maxHeight: height,
                                    // width: '100%'
                                    width: Dimensions.get('window').width,
                                }}
                                data={items}
                                renderItem={renderItem}
                                snapToInterval={height}
                                showsVerticalScrollIndicator={false}
                                fadingEdgeLength={height}
                                overScrollMode={'never'}
                                onScroll={onScrollFn}
                                onMomentumScrollEnd={onMomentumScrollEndFn}
                                getItemLayout={getItemLayoutFn}
                            // scrollEventThrottle={3}
                            />
                        </ImageBackground>
                    </View>

                </ImageBackground>
                <View style={{
                    // flex: 1,
                    // justifyContent: '',
                    alignItems: 'center',
                    // margin: 'auto'
                }}>
                    <Text style={styles.deaths}>D E A T H S</Text>
                    <Image
                        source={require('../assets/ornament-feathers.png')}
                        resizeMode={'contain'}
                        style={{
                            // width: 70,
                            height: 50
                            // bottom: 30,
                        }}
                    />
                </View>
            </View>

            <View style={{
                marginBottom: '10%',
                width: '100%'
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    height: 100,
                }}>
                    <Text
                        adjustsFontSizeToFit

                        style={styles.bossname}
                    >
                        {mmkvBossesList == undefined || mmkvBossesList.length == 0 ? 'please add a boss' : _newLineAtComma(mmkvBossesList[0].title)}
                    </Text>
                </View>
                <Image
                    source={require('../assets/ornament-leaves.png')}
                    resizeMode={'contain'}
                    style={{
                        height: 13,
                        alignSelf: 'center',
                        marginTop: 5
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    count: {
        fontSize: 180,
        textAlign: 'center',
        color: '#BB8D43',
        fontFamily: 'OptimusPrinceps',
        width: '100%',

    },
    deaths: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'RomanAntique',
        color: '#F3D39E',
        // bottom: 5,
    },
    bossname: {
        // textDecorationLine: 'line-through',
        fontSize: 28,
        textAlign: 'center',
        fontFamily: 'OptimusPrinceps',
        color: '#F3D39E',
        textShadowColor: '#F3D39E',
        textShadowRadius: 15,
        flexWrap: 'wrap',
        flex: 0.8,

    },
    ringImageBgComponent: {
        // justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'visible',
        // width: '100%'

        // width: 300,
        // height: 430
    },
    ringImageBgStyle: {
        // bottom: 110,
        opacity: 0.2,
        transform: [{
            scale: 2
        }]
    }
})
