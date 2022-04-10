import { ImageBackground, StyleSheet, TouchableNativeFeedback, View, Text } from 'react-native'

export default function BossRenderItem(props) {

    const handleItemTouch = () => {
        props.onTouchHandler(props.item)
    }

    return (
        <TouchableNativeFeedback onPress={handleItemTouch}>
            <View style={styles.item}>
                <View style={styles.itemTextContainer}>
                    <View style={styles.itemTextSubContainer}>
                        <Text style={styles.itemText}>{props.itemText}</Text>
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
                        <Text style={styles.deathCount}>{props.item.deaths}</Text>
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