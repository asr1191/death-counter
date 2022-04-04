import React, { useEffect, useState, useRef } from 'react'
import {
    Text,
    View,
    StyleSheet,
    FlatList,
    Pressable,
    Dimensions,
    Image,
    ImageBackground
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import * as SplashScreen from 'expo-splash-screen';
import { useKeepAwake } from 'expo-keep-awake';
import { AsyncStorageHelper } from '../components/AsyncStorageHelper';

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


export default function CounterScreen() {

    const [items, setItems] = useState([])
    const [height, setHeight] = useState(0)

    const [index, setIndex] = useState(-1)
    const [bossName, setBossName] = useState('Loading..')

    const counterRef = useRef(null)
    useKeepAwake();

    let lastSaveTime = 0;

    //Run once after mounting
    useEffect(() => {
        setItems(_initItemArray(MAX_DEATH))
        async function getAndScrollToIndex() {
            try {
                // AsyncStorage.clear();
                const startTime = new Date().getTime();
                const targetIndex = await AsyncStorageHelper.getDataAsync('index')
                const duration = new Date().getTime() - startTime;

                const bossName = await AsyncStorageHelper.getDataAsync('bossName')

                console.log('Retrieved index (' + targetIndex + ') from storage in %sms', duration);
                console.log('Retrieved boss name (' + bossName + ') from storage');

                setTimeout(() => { setIndex(!isNaN(targetIndex) ? parseInt(targetIndex) : 0) }, 250)

                // setTimeout(() => { SplashScreen.hideAsync() }, 500)
                // setTimeout(() => { _scrollToIndexCounter(targetIndex) }, 5000)

            } catch (e) {
                console.warn(e)
            }
        }
        getAndScrollToIndex()
    },
        []
    )

    useEffect(() => {
        // SplashScreen.hideAsync();
        console.log('Current Index: ' + index);
        async function storeIndex() {
            await AsyncStorageHelper.storeDataAsync('index', String(index))
            console.log('Saved index (' + index + ') to storage');
        }
        if (index >= 0 && index < MAX_DEATH) {
            console.log('Scrolling to %d', index);
            counterRef.current.scrollToIndex({
                index: index
            })
            storeIndex();
        }
    },
        [index]
    )

    const _incrementCounter = () => {
        if (index + 1 < MAX_DEATH) {
            setIndex(index + 1)
        }
    }

    // List Items 
    const renderItem = ({ item }) =>
    (
        <Pressable onPress={_incrementCounter}>
            <View
                onLayout={(event) => {
                    setHeight(event.nativeEvent.layout.height)
                }}
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%'
                }}
            >
                <ImageBackground
                    style={{
                        width: '100%',
                    }}
                    imageStyle={{
                        height: '100%',
                        opacity: 0.7
                    }}
                    resizeMode={'center'}
                    source={require('../assets/count-glow-2.png')}
                >
                    <Text style={styles.count}>{item.title}</Text>
                </ImageBackground>
            </View>
        </Pressable>

    )



    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',

        }}>
            <View>
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
                        <FlatList
                            ref={counterRef}
                            initialScrollIndex={index}
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
                            onMomentumScrollEnd={(event) => {
                                let floored = Math.floor(Math.floor(event.nativeEvent.contentOffset.y) / Math.floor(height))
                                setIndex(floored)
                            }}
                            scrollEventThrottle={3}
                            getItemLayout={(data, index) => ({ length: height, offset: height * index, index })}
                        />
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
                }}>
                    <Text style={styles.bossname}>Loretta, Knight of the Haligtree</Text>
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
        width: '100%'

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
