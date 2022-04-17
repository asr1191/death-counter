import { StyleSheet, TouchableOpacity, View } from "react-native"
import { MaterialCommunityIcons } from '@expo/vector-icons';

import remove from 'lodash.remove';
import { useCallback } from "react";

export default function BossHiddenRenderItem({ data, rowMap, setMMKVBossesList }) {

    const closeRow = useCallback(() => {
        rowMap[data.item.key].closeRow()
    }, [rowMap, data])

    const deleteRow = useCallback(() => {
        setMMKVBossesList((prevList) => {
            const newBosses = [...prevList]
            console.log('BOSSES-LIST: Deleting boss (%s)', data.item.title);
            remove(newBosses, (boss) => {
                return data.item.key == boss.key
            })
            // console.log(newBosses);
            return newBosses
        })
    }, [setMMKVBossesList, data])

    return (
        <View style={styles.hiddenItem}>
            <TouchableOpacity
                style={styles.buttonStyle}
                onPress={closeRow}
            >
                <MaterialCommunityIcons
                    name="sword-cross"
                    size={35}
                    color='rgba(47, 42, 35, 1)'
                    style={styles.iconStyle}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.buttonStyle}
                onPress={deleteRow}
            >
                <MaterialCommunityIcons
                    name="delete-outline"
                    size={35}
                    color='rgba(47, 42, 35, 1)'
                    style={styles.iconStyle}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    iconStyle: {
        margin: 20
    },
    hiddenItem: {
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
    buttonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
})