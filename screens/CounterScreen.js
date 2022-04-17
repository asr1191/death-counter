import React, { useEffect, useState, useRef, useContext, useCallback } from 'react'
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
import useDBObject from '../hooks/useDBObject';
import { BossContext } from '../contexts/BossContext';
import * as SplashScreen from 'expo-splash-screen';

const MAX_DEATH = 501
const ITEM_HEIGHT = 200
const ITEM_ARRAY = _initItemArray(MAX_DEATH)

function _initItemArray(maxNumber) {
    console.log('POPULATING COUNTER LIST YOOOOOOOOOOOOOOOOOOOO');
    items = [];
    for (let index = 0; index < maxNumber; index++) {
        items.push({
            id: index,
            title: (index).toString()
        })
    }
    return items;
}

let scrollPosition = -1

export default function CounterScreen(props) {
    const [canMomentum, setCanMomentum] = useState(false);

    const { selectedBoss, setPreviewBoss, setDBObj } = useContext(BossContext)
    const counterRef = useRef(null)

    useKeepAwake();

    //Run once after mounting
    useEffect(() => {
        try {
            counterRef.current.scrollToIndex({
                index: selectedBoss.deaths
            })

        } catch (e) {
            console.warn('COUNTERREF ERRORO LMAO');
        }
        SplashScreen.hideAsync()
    },
        []
    )

    useEffect(() => {
        console.log('<========NEW RENDER (COUNTER SCREEN)========>');
    })

    useEffect(() => {
        // if (mmkvBossesList != undefined && mmkvBossesList.length != 0) {
        console.log('PREVIEW BOSS: %s', selectedBoss);
        console.log('COUNTER: scrollPosition (%d), count (%d)', scrollPosition, selectedBoss.deaths);
        if (scrollPosition != selectedBoss.deaths && counterRef.current != null) {
            console.log('COUNTER: scrollPosition different from parent state! (%d, %d). Scrolling to %d', scrollPosition, selectedBoss.deaths, selectedBoss.deaths);
            try {
                counterRef.current.scrollToIndex({
                    index: selectedBoss.deaths,
                })
            } catch (e) {
                console.warn('COUNTERREF ERRORO LMAO');
            }
            scrollPosition = selectedBoss.deaths
            console.log('NAVIGATOR: Navigating to DeathsScreen');
        }
        // } else {
        //     console.log('COUNTER: Resetting to zero');
        //     console.log(mmkvBossesList);
        //     try {
        //         counterRef.current.scrollToIndex({
        //             index: 0
        //         })
        //     } catch (e) {
        //         console.warn('COUNTERREF ERRORO LMAO');
        //     }
        // }

    }, [selectedBoss, counterRef])


    const _incrementCounter = useCallback(() => {
        try {
            counterRef.current.scrollToIndex({
                index: scrollPosition + 1
            })
        } catch (e) {
            console.warn('COUNTERREF ERRORO LMAO');
        }
        scrollPosition += 1
        setDBObj((prev) => {
            let newList = [...prev]
            if (prev != undefined && prev != 0) {
                if (newList[0].deaths + 1 < MAX_DEATH && counterRef.current != null) {
                    console.log('COUNTER: Incrementing to %d', newList[0].deaths + 1);

                    const newBoss = {
                        key: newList[0].key,
                        title: newList[0].title,
                        deaths: newList[0].deaths + 1
                    }

                    newList.splice(0, 1, newBoss)
                    return newList
                }
            }
        })
    }, [setDBObj, counterRef, scrollPosition])

    // List Items 
    const renderItem = useCallback(({ item }) =>
    (
        <Pressable onPress={_incrementCounter}>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: ITEM_HEIGHT
                }}
            >
                <Text style={styles.count} adjustsFontSizeToFit allowFontScaling={false} >{item.title}</Text>
            </View>
        </Pressable>
    ), [_incrementCounter])


    const onScrollFn = useCallback(() => {
        setCanMomentum(true)
    }, [])

    const onMomentumScrollEndFn = useCallback((event) => {
        if (canMomentum) {
            let floored = Math.floor(Math.floor(event.nativeEvent.contentOffset.y) / Math.floor(ITEM_HEIGHT))
            scrollPosition = floored;
            console.log('COUNTER: Set scrollPosition (%d)', floored);

            setDBObj(prevList => {
                let newList = [...prevList]
                const newBoss = {
                    key: newList[0].key,
                    title: newList[0].title,
                    deaths: floored
                }
                newList.splice(0, 1, newBoss)
                return newList
            })
        }
        setCanMomentum(false)
    }, [setDBObj, canMomentum])

    const getItemLayoutFn = useCallback((data, index) => {
        return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
    }, [ITEM_HEIGHT])

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
                                style={styles.flatList}
                                initialScrollIndex={selectedBoss.deaths}
                                data={ITEM_ARRAY}
                                renderItem={renderItem}
                                snapToInterval={ITEM_HEIGHT}
                                showsVerticalScrollIndicator={false}
                                fadingEdgeLength={ITEM_HEIGHT}
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
                        {selectedBoss.title}
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
    flatList: {
        maxHeight: ITEM_HEIGHT,
        width: Dimensions.get('window').width,
    },
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
