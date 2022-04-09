import { StyleSheet, TouchableOpacity, View } from "react-native"
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import remove from 'lodash.remove';

export default function BossHiddenRenderItem(props) {

    const closeRow = () => {
        props.rowMap[props.data.item.key].closeRow()
    }

    const deleteRow = () => {
        const newBosses = [...props.mmkvBossesList]
        remove(newBosses, (boss) => {
            if (props.data.item.key == boss.key) {
                console.log('Deleting item with key (%s)', boss.key);
                return true
            } else {
                return false
            }
        })
        // console.log(newBosses);
        props.setMMKVBossesList(newBosses)
    }

    const hiddenItemOnLayout = (event) => {
        if (props.hiddenRowButtonWidth == 0) {
            props.setHiddenRowButtonWidth(event.nativeEvent.layout.width)
        }
    }

    return (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={styles.backBtn}
                onPress={closeRow}
                onLayout={hiddenItemOnLayout}
            >
                <MaterialCommunityIcons
                    name="sword-cross"
                    size={35}
                    color='rgba(47, 42, 35, 1)'
                    style={{
                        margin: 20
                    }}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.backBtn}
                onPress={deleteRow}
            >
                <MaterialCommunityIcons
                    name="delete-outline"
                    size={35}
                    color='rgba(47, 42, 35, 1)'
                    style={{
                        margin: 20
                    }}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    rowBack: {
        alignItems: 'center',
        backgroundColor: 'rgba(243, 211, 158, 1)',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // paddingLeft: 15,
        borderRadius: 16,
        // paddingVertical: 20,
        marginBottom: 11
    },
    backBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
})