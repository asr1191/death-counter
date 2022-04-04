import { useEffect, useState } from 'react';

import { DatabaseHelper } from '../components/DatabaseHelper'

export default function useDatabase(setDBLoadingComplete) {
    // const [isDBLoadingComplete, setDBLoadingComplete] = useState(false);

    useEffect(() => {
        async function loadDataAsync() {
            try {
                await DatabaseHelper.dropAllBossesTableAsync()
                await DatabaseHelper.dropUserBossesTableAsync()

                await DatabaseHelper.setupAllBossesTableAsync()
                await DatabaseHelper.setupUserBossesTableAsync()

                DatabaseHelper.tableRowCount('user_bosses', (arr) => { console.log('user_bosses table row count: %d', arr) });
                // await DatabaseHelper.setupBossesAsync()

                console.log('Finished database setup')

                setDBLoadingComplete(true);


            } catch (e) {
                console.log('In Outside Catch');
                console.warn(e);
            }
        }

        loadDataAsync();
    }, []);

    // return { isDBLoadingComplete };
}