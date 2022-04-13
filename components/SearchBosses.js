import React, { useEffect, useState } from 'react'
import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

// const MemoizedSwipeListView = React.memo(SwipeListView)
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import filter from 'lodash.filter';

export default function SearchBosses({
    bossesSwipeListRef,
    mmkvBossesList,
    renderItem,
    renderHiddenItem,
    hiddenRowButtonWidth,
    onRowDidOpen,
    addBossHandler
}) {

    const [searchInputText, setSearchInputText] = useState('')
    // let filteredBosses = mmkvBossesList

    // useEffect(() => {
    //     filteredBosses = mmkvBossesList
    // }, [])

    // useEffect(() => {
    //     filteredBosses = filter(mmkvBossesList, (item) => {
    //         let itemText = item.title.toLowerCase()
    //         return itemText.includes(searchInputText.toLowerCase())
    //     })
    // }, [mmkvBossesList, searchInputText])

    const getSearchResults = () => {
        let filteredBosses = filter(mmkvBossesList, (item) => {
            let itemText = item.title.toLowerCase()
            return itemText.includes(searchInputText.toLowerCase())
        })

        return filteredBosses
    }


    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <View style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                paddingVertical: 20,
                marginBottom: 20,
                // marginHorizontal: 20,
                paddingHorizontal: 10,
                borderBottomColor: 'rgba(243, 211, 158, 0.2)',
                borderBottomWidth: 1,
                // borderRadius: 20
            }}>
                <TextInput
                    autoCapitalize={'sentences'}
                    autoCorrect={false}
                    value={searchInputText}
                    onChangeText={setSearchInputText}
                    placeholder={"Search or add bosses..."}
                    style={styles.searchBox}
                />
                <TouchableOpacity
                    onPress={addBossHandler}
                >
                    <View style={{
                        borderRadius: 5,
                        marginLeft: 10,
                        width: 50,
                        backgroundColor: 'rgba(243, 211, 158, 1)',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                        // height: '100%',
                    }}>
                        <MaterialIcons name="add" size={35} color="rgba(47, 42, 35, 1)" />

                    </View>
                </TouchableOpacity>
            </View>
            <SwipeListView
                listViewRef={bossesSwipeListRef}
                style={styles.list}
                data={getSearchResults()}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                showsVerticalScrollIndicator={false}
                fadingEdgeLength={50}
                overScrollMode={'never'}
                leftOpenValue={hiddenRowButtonWidth}
                rightOpenValue={-hiddenRowButtonWidth}
                stopLeftSwipe={hiddenRowButtonWidth * 1.5}
                stopRightSwipe={-hiddenRowButtonWidth * 1.5}
                previewRowKey={'2'}
                previewOpenValue={-40}
                // previewRepeat={true}
                // previewDuration={500}
                // previewRepeatDelay={500}
                previewOpenDelay={1000}
                // onRowDidOpen={onRowDidOpen}
                friction={600}
                tension={500}
            // recalculateHiddenLayout={true}
            // extraData={mmkvBossesList}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    list: {
        width: '95%',
        marginBottom: 10
    },
    searchBox: {
        flex: 1,
        backgroundColor: '#3B352B',
        // marginVertical: 30,
        // width: '100%',
        fontSize: 20,
        fontFamily: 'RomanAntique',
        color: 'rgb(243,211,158)',
        borderRadius: 5,
        padding: 5,
        paddingHorizontal: 10
    },
})