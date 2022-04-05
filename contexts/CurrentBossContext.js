const { useState, createContext } = require("react");


const [currentBoss, setCurrentBoss] = useState({
    name: 'select boss to begin',
    count: 0
})

const setCurrentBossWrapper = (name, count) => {
    setCurrentBoss({
        name: name,
        count: count
    })
}


export const Context = createContext({ currentBoss, setCurrentBossWrapper })

export default function CurrentBossContext(props) {

    return <Context.Provider>{props.children}</Context.Provider>

}
