import { useEffect, useState } from 'react';

import { DatabaseHelper } from '../components/DatabaseHelper'

export default function useDatabase() {
    const [isDBLoadingComplete, setDBLoadingComplete] = useState(false);

    useEffect(() => {
        async function loadDataAsync() {
            try {
                await DatabaseHelper.dropDatabaseTablesAsync()
                await DatabaseHelper.setupDatabaseAsync()
                await DatabaseHelper.setupBossesAsync()

                console.log('Finished database setup')

                setDBLoadingComplete(true);


            } catch (e) {
                console.log('In Outside Catch');
                console.warn(e);
            }
        }

        loadDataAsync();
    }, []);

    return { isDBLoadingComplete };
}