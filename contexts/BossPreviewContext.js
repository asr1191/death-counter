const { useState, createContext, useRef } = require("react");

export const BossPreviewContext = createContext({})

export default function BossPreviewContextProvider(props) {

    const previewBossRef = useRef({
        title: 'please add/select a boss',
        deaths: 0
    })

    const setPreviewBoss = ({ title, deaths }) => {
        if (title == undefined || deaths == undefined) {
            console.log('CONTEXT-FUNCTION: Invalid data, resetting.. (%s, %d)', title, deaths);
            previewBossRef.current = {
                title: 'please add/select a boss',
                deaths: 0
            }
        }
        console.log('CONTEXT-FUNCTION: Updating currently selected boss to (%s, %d)', title, deaths);
        previewBossRef.current = {
            title: title,
            deaths: deaths
        }
    }

    const value = {
        previewBossRef: previewBossRef,
        setPreviewBoss: setPreviewBoss
    }

    return <BossPreviewContext.Provider value={value}>{props.children}</BossPreviewContext.Provider>

}
