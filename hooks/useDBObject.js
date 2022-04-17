import { useContext, useEffect } from "react";
import { useMMKVString } from "react-native-mmkv";
import { BossContext } from "../contexts/BossContext";


export default function useDBObject(key) {

    const [str, setStr] = useMMKVString(key)
    const { previewBoss, setPreviewBoss } = useContext(BossContext)

    useEffect(() => {
        // if(str == undefined || JSON.parse(str).length == 0)
        console.log("STR: %s...", str.slice(0, 50));
        setPreviewBoss(JSON.parse(str)[0])
    }, [str])

    const setData = (v) => {
        const dataObj = str != undefined ? JSON.parse(str) : undefined
        if (typeof v === 'function') {
            const newData = v(dataObj)
            if (newData != undefined) {
                // setPreviewBoss(newData[0])
                console.log('BLUEH');
                setStr(JSON.stringify(newData))
            }
        }
        else {
            console.log('BLUEH123123123');
            // setPreviewBoss(v[0])
            setStr(JSON.stringify(v))
        }
    }

    return [JSON.parse(str), setData]
}