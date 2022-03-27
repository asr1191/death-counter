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

const MAX_DEATH = 201

function initItemArray(maxNumber) {
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
    const [index, setIndex] = useState(0)

    useEffect(() => {
        setItems(initItemArray(MAX_DEATH))
    },
        []
    )

    const counterRef = useRef(null)



    const renderItem = ({ item }) =>
    (
        <Pressable onPress={incrementCounter}>
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
                    source={require('../assets/count-glow.png')}
                >
                    <Text style={styles.count}>{item.title}</Text>
                </ImageBackground>
            </View>
        </Pressable>

    )

    const incrementCounter = () => {
        if (index + 1 < MAX_DEATH) {
            counterRef.current.scrollToIndex({
                index: index + 1
            })
            setIndex(index + 1)
        }
    }


    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',

        }}>
            <View
                style={{
                    // flex: 1,
                    // backgroundColor: 'pink'
                }}
            >
                {/* <Text>Hi</Text> */}
            </View>

            <View style={{
                alignItems: 'center',
            }}>
                <ImageBackground
                    style={styles.ringImageBgComponent}
                    source={require('../assets/elden-ring-transparent-edge.png')}
                    resizeMode={'cover'}
                    imageStyle={styles.ringImageBgStyle}
                    blurRadius={3}
                >
                    <FlatList
                        ref={counterRef}
                        style={{
                            maxHeight: height,
                            width: Dimensions.get('window').width,
                        }}
                        data={items}
                        renderItem={renderItem}
                        snapToInterval={height}
                        showsVerticalScrollIndicator={false}
                        fadingEdgeLength={height * 0.9}
                        overScrollMode={'never'}
                        onMomentumScrollEnd={(event) => {
                            let floored = Math.floor(Math.floor(event.nativeEvent.contentOffset.y) / Math.floor(height))
                            setIndex(floored)
                        }}
                        getItemLayout={(data, index) => ({ length: height, offset: height * index, index })}

                    />

                    <Text style={styles.deaths}>D E A T H S</Text>

                    <Image
                        source={require('../assets/ornament-feathers.png')}
                        resizeMode={'contain'}
                        style={{
                            width: 70,
                            bottom: 30,
                        }}
                    />
                </ImageBackground>
            </View>

            <View style={{
                // flexBasis: 150
                marginBottom: 50
            }}>
                <Text style={styles.bossname}>Malenia,{'\n'}Blade of Miquella</Text>
                <Image
                    source={require('../assets/ornament-leaves.png')}
                    resizeMode={'contain'}
                    style={{
                        height: 13,
                        marginTop: 5,
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
        color: '#CFBB9B',
        bottom: 5,
    },
    bossname: {
        fontSize: 30,
        textAlign: 'center',
        fontFamily: 'OptimusPrinceps',
        color: '#F3D39E',
        textShadowColor: '#F3D39E',
        textShadowRadius: 30,
        paddingTop: 10,
        height: 80
    },
    ringImageBgComponent: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: 300,
        height: 430
    },
    ringImageBgStyle: {
        bottom: 100,
        opacity: 0.2
    }
})
