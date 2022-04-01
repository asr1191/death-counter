import React, { useState, useRef, useEffect } from 'react'

import {
    Text,
    View,
    Dimensions,
    FlatList,
    StyleSheet,
    TextInput,
    ImageBackground
} from 'react-native';
import filter from 'lodash.filter';

const MAX_DEATH = 100

function _initItemArray(maxNumber) {
    items = [];
    for (let index = 0; index < maxNumber; index++) {
        items.push({
            id: index,
            title: 'Rennala, Queen of the Full Moon',
            deaths: 69
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


export default function DatabaseScreen() {

    const [items, setItems] = useState([])

    useEffect(() => {
        // setItems(_initItemArray(MAX_DEATH))
        setItems(require('../data/bosses.json').data)
    }, [])

    const handleSearch = function _handleSearch(queryText) {
        // setItems([])
    }
    const renderItem = ({ item }) =>
    (
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
    )

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View>
                <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    clearButtonMode="always"
                    // value={''}
                    onChangeText={queryText => handleSearch(queryText)}
                    placeholder="Search"
                    style={styles.searchBox}
                />
            </View>
            <FlatList
                style={styles.list}
                data={items}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                fadingEdgeLength={50}
                overScrollMode={'never'}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    searchBox: {
        backgroundColor: 'rgba(243, 211, 158, 0.1)',
        marginBottom: 30
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'rgba(243, 211, 158, 0.1)',
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
    },
    deathCount: {
        fontSize: 40,
        color: 'rgb(243, 211, 158)',
        // color: '#BB8D43',
        fontFamily: 'OptimusPrinceps',
    }
})
