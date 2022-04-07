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
import { AsyncStorageHelper } from '../components/AsyncStorageHelper';

import { Context } from '../contexts/CurrentBossContext';
import reTryTask from '../components/reTryTask';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const scrollFn = async (ref, index) => {
    ref.current.scrollToIndex({
        index: index
    })
}

export default function CounterScreen() {

    const [items, setItems] = useState(_initItemArray(MAX_DEATH))
    const [height, setHeight] = useState(-1)
    const [canMomentum, setCanMomentum] = useState(false);

    const { currentBoss: { count, name }, setCurrentBossWrapper } = useContext(Context);

    const counterRef = useRef(null)

    useKeepAwake();

    //Run once after mounting
    useEffect(() => {
        // setItems()

        async function retrieveSavedBoss() {
            try {
                AsyncStorage.clear()
                const startTime = new Date().getTime();
                let savedBoss = JSON.parse(await AsyncStorageHelper.getDataAsync('savedBoss'))
                const duration = new Date().getTime() - startTime;

                if (savedBoss != null) {
                    console.log('ASYNCSTORAGE: Retrieved boss (%s, %d) in %sms', savedBoss.name, savedBoss.count, duration);
                    setCurrentBossWrapper(savedBoss.name, parseInt(savedBoss.count))
                    // if (counterRef.current != null) {
                    //     counterRef.current.scrollToIndex({
                    //         index: savedBoss.count
                    //     })
                    // }
                } else {
                    console.log('ASYNCSTORAGE: No boss data retrieved.');
                    setCurrentBossWrapper('please select a boss', 0)
                }

            } catch (e) {
                console.warn(e)
            }
        }
        retrieveSavedBoss()
    },
        []
    )

    // Storage of selected boss
    useEffect(() => {
        async function storeIndex() {
            const savedBoss = {
                name: name,
                count: count
            }

            await AsyncStorageHelper.storeDataAsync('savedBoss', JSON.stringify(savedBoss))
            console.log('ASYNCSTORAGE: Saved boss (%s, %d)', name, count);
        }

        if (count >= 0) {
            console.log('COUNTER: scrollPosition (%d), count (%d)', scrollPosition, count);
            if (scrollPosition != count && counterRef.current != null) {
                console.log('COUNTER: scrollPosition different from parent state! (%d, %d). Scrolling to %d', scrollPosition, count, count);
                console.log('Also, data count: ', items.length);
                try {
                    //     reTryTask(3, () => {
                    // setTimeout(() => {
                    scrollFn(counterRef, count);
                    // }, 0);
                    // })
                } catch (e) {
                    console.log('COUNTER: Items length (%d)', items.length);
                    console.warn('COUNTERREF ERRORO LMAO');
                }
                // }
                scrollPosition = count
            }

            storeIndex();
        }
    },
        [name, count]
    )

    const _incrementCounter = () => {
        if (count + 1 < MAX_DEATH && counterRef.current != null) {
            const newCount = count + 1
            console.log('COUNTER: Incrementing and scrolling to %d', newCount);
            // reTryTask(3, () => {
            //     counterRef.current.scrollToIndex({
            //         index: newCount
            //     })
            // })
            setCurrentBossWrapper(name, newCount)
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
                {/* <ImageBackground
                    style={{
                        width: '100%',
                    }}
                    imageStyle={{
                        height: '100%',
                        opacity: 0.7
                    }}
                    resizeMode={'center'}
                    source={require('../assets/count-glow-2.png')}
                > */}
                <Text style={styles.count} adjustsFontSizeToFit  >{item.title}</Text>
                {/* </ImageBackground> */}
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
            setCurrentBossWrapper(name, floored)
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
                        alignItems: 'center'
                    }}>
                        <ImageBackground
                            style={{
                                // width: '100%',
                            }}
                            imageStyle={{
                                // height: '100%',
                                opacity: 0.7
                            }}
                            resizeMode={'center'}
                            source={require('../assets/count-glow-2.png')}
                        >

                            <FlatList
                                ref={counterRef}
                                initialScrollIndex={count}
                                style={{
                                    maxHeight: height,
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
                                // scrollEventThrottle={3}
                                getItemLayout={getItemLayoutFn}
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
                        {_newLineAtComma(name)}
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
        overflow: 'visible'

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
