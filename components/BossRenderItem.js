import { useCallback } from 'react'
import { StyleSheet, TouchableNativeFeedback, View, Text } from 'react-native'
import useDBObject from '../hooks/useDBObject'


export default function BossRenderItem({ item, rowMap, deathCountImage, setMMKVBossesList, setPreviewBoss, itemText, navigation }) {


    const findBossFactory = useCallback((target) => {
        const findFunction = (element) => {
            return element.key == target.key
        }
        return findFunction
    })

    const onTouchHandlerItem = useCallback(() => {
        setMMKVBossesList((prevList) => {
            if (item != prevList[0]) {
                let newBossesList = [...prevList]
                // console.log('PREVLIST: %s', prevList[0]);
                // console.log('ITEM: %s', item);
                // console.log('ITEM INDEX: %s', newBossesList.findIndex(findBossFactory(item)))
                // console.log('ROWMAP: %d', Object.keys(rowMap).length);
                newBossesList.unshift(newBossesList.splice(newBossesList.findIndex(findBossFactory(item)), 1)[0])
                setPreviewBoss(newBossesList[0])
                console.log('BOSSESLIST: Shifted boss to top %s', newBossesList[0]);
                return newBossesList;
            }
        })
        navigation.navigate('D E A T H S')
    }, [setMMKVBossesList])

    return (
        <TouchableNativeFeedback onPress={onTouchHandlerItem}>
            <View style={styles.item}>
                <View style={styles.itemTextContainer}>
                    <View style={styles.itemTextSubContainer}>
                        <Text style={styles.itemText}>{itemText}</Text>
                    </View>
                </View>
                <View style={styles.itemDeathContainer}>
                    {/* <ImageBackground
                        style={styles.deathCountImageContainer}
                        imageStyle={styles.deathCountImage}
                        source={props.deathCountImage}
                        resizeMode={'contain'}
                    > */}
                    <View style={styles.deathCountTextContainer}>
                        <Text style={styles.deathCount}>{item.deaths}</Text>
                    </View>
                    {/* </ImageBackground> */}
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
        marginBottom: 10,
    },
    itemTextContainer: {
        justifyContent: 'center',
        flex: 3,
        marginLeft: 20

    },
    itemTextSubContainer: {
        flex: 1,
        justifyContent: 'center',
        marginVertical: 20
    },
    itemText: {
        fontSize: 20,
        color: 'rgb(243, 211, 158)',
        fontFamily: 'OptimusPrinceps',
    },
    itemDeathContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(243, 211, 158, 0.1)',
        marginVertical: 20,
    },
    deathCountImageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deathCountImage: {
        opacity: 0.1,
        transform: [{
            scale: 1.5
        }]
    },
    deathCountTextContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deathCount: {
        fontSize: 40,
        color: 'rgb(243, 211, 158)',
        // color: '#BB8D43',
        fontFamily: 'OptimusPrinceps',
    },
})