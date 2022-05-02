const { useEffect, useState, createContext } = require("react");
import { useMMKVString } from "react-native-mmkv";

export const BossContext = createContext({})

const defaultBoss = {
    key: 'lolnoid',
    title: 'please add/select a boss',
    deaths: 0
}

export default function BossContextProvider(props) {

    const [_str, _setStr] = useMMKVString('bosses_list2')
    const [selectedBoss, setSelectedBoss] = useState(defaultBoss)

    useEffect(() => {
        if (selectedBoss.key == 'lolnoid' && _str != null) {
            console.log('INIT: Setting previewBoss as %s', JSON.parse(_str)[0]);
            setSelectedBossWrapper(JSON.parse(_str)[0])
        }
    }, [_str])

    const setSelectedBossWrapper = (boss) => {
        if (boss != undefined) {
            if (boss.title == undefined || boss.deaths == undefined) {
                console.log('CONTEXT-FUNCTION: Invalid setSelectedBoss params, resetting..');
                setSelectedBoss(defaultBoss)
            }
            console.log('CONTEXT-FUNCTION: Updating currently selected boss to (%s, %d)', boss.title, boss.deaths);
            setSelectedBoss({
                key: boss.key,
                title: boss.title,
                deaths: boss.deaths
            })
        } else {
            console.log('CONTEXT-FUNCTION: Updating previewBoss to default');
            setSelectedBoss(defaultBoss)
        }
    }

    const setData = (v) => {
        const dataObj = _str != undefined ? JSON.parse(_str) : undefined
        if (typeof v === 'function') {
            const newData = v(dataObj)
            if (newData != undefined) {
                console.log('CONTEXT-FUNCTION: Setting string data through callback');
                _setStr(JSON.stringify(newData))
            }
        }
        else {
            console.log('CONTEXT-FUNCTION: Setting string data');
            _setStr(JSON.stringify(v))
        }
    }

    const value = {
        selectedBoss: selectedBoss,
        setPreviewBoss: setSelectedBossWrapper,
        getDBObj: _str != undefined ? JSON.parse(_str) : undefined,
        setDBObj: setData
    }

    return <BossContext.Provider value={value}>{props.children}</BossContext.Provider>

}

