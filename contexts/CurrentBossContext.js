const { useState, createContext } = require("react");

export const Context = createContext({})

export default function CurrentBossContext(props) {

    const [currentBoss, setCurrentBoss] = useState({
        name: 'omg lol, dont look',
        count: -1
    })

    const setCurrentBossWrapper = (name, count) => {
        console.log('CONTEXT-FUNCTION: Updating currently selected boss to (%s, %d)', name, count);
        setCurrentBoss({
            name: name,
            count: count
        })
    }

    const contextValue = { currentBoss, setCurrentBossWrapper }

    return <Context.Provider value={contextValue}>{props.children}</Context.Provider>

}
