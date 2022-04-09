import { ImageBackground, StyleSheet, TouchableNativeFeedback, View, Text } from 'react-native'

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

// const findBossIndex = (element) => {
//     item.
// }


export default function BossRenderItem(props) {

    const handleItemTouch = () => {
        if (props.item != props.mmkvBossesList[0]) {
            let newBossesList = props.mmkvBossesList
            newBossesList.unshift(newBossesList.splice(newBossesList.indexOf(props.item), 1)[0])
            props.setMMKVBossesList(newBossesList);
            props.bossesListRef.current.scrollToIndex({
                index: 0
            })
            props.navigation.navigate('D E A T H S')
        }
    }

    return (
        <TouchableNativeFeedback onPress={handleItemTouch}>
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
                        <Text style={styles.itemText}>{_newLineAtComma(props.item.title)}</Text>
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
                        source={props.deathCountImage}
                        resizeMode={'contain'}
                    >
                        <View style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            // paddingVertical: 20
                        }}>
                            <Text style={styles.deathCount}>{props.item.deaths}</Text>
                        </View>
                    </ImageBackground>
                </View>
            </View>
        </TouchableNativeFeedback>
    )
}


const styles = StyleSheet.create({
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
})