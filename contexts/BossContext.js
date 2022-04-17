const { useEffect, useState, createContext, useRef } = require("react");
import { useMMKVString } from "react-native-mmkv";

export const BossContext = createContext({})

export default function BossContextProvider(props) {

    const [_str, _setStr] = useMMKVString('bosses_list2')
    const [selectedBoss, setSelectedBoss] = useState({
        key: 'lolnoid',
        title: 'please add/select a boss',
        deaths: 0
    })

    const previewBossRef = useRef({
        key: 'lolnoid',
        title: 'please add/select a boss',
        deaths: 0
    })

    useEffect(() => {
        if (previewBossRef.current.key == 'lolnoid') {
            console.log('INIT: Setting previewBoss as %s', JSON.parse(_str)[0]);
            setPreviewBoss(JSON.parse(_str)[0])
        }
    }, [_str])

    useEffect(() => {
        // const fetchedAllBossesData = require('../data/MOCK_DATA.json').data
        // setData(fetchedAllBossesData)
        // setPreviewBoss(fetchedAllBossesData[0])
    }, [])

    const setPreviewBoss = ({ key, title, deaths }) => {
        if (title == undefined || deaths == undefined) {
            console.log('CONTEXT-FUNCTION: Invalid data, resetting.. (%s, %d)', title, deaths);
            previewBossRef.current = {
                key: 'lolnoid',
                title: 'please add/select a boss',
                deaths: 0
            }
        }
        console.log('CONTEXT-FUNCTION: Updating currently selected boss to (%s, %d)', title, deaths);
        previewBossRef.current = {
            key: key,
            title: title,
            deaths: deaths
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
        previewBossRef: previewBossRef,
        setPreviewBoss: setPreviewBoss,
        getDBObj: JSON.parse(_str),
        setDBObj: setData
    }

    return <BossContext.Provider value={value}>{props.children}</BossContext.Provider>

}
