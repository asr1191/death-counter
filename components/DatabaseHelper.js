import * as SQLite from "expo-sqlite"

const db = SQLite.openDatabase('db.db')

const ALL_BOSSES_TABLE = "all_bosses"
const USER_BOSSES_TABLE = "user_bosses"

const getBosses = (setBossesCallback) => {
    db.transaction(
        tx => {
            tx.executeSql(
                'select * from ?',
                [ALL_BOSSES_TABLE],
                (_, { rows: { _array } }) => {
                    setBossesCallback(_array)
                }
            );
        },
        (t, error) => { console.log("db error load bosses"); console.log(error) },
        (_t, _success) => { console.log("loaded bosses") }
    );
}

const insertBoss = (bossFirstName, bossLastName, deathCountArray, successFunc) => {
    db.transaction(tx => {
        tx.executeSql('insert into ? (boss_first_name, boss_last_name, death_count_array) values (?, ?, ?)', [ALL_BOSSES_TABLE, bossFirstName, bossLastName, deathCountArray]);
    },
        (t, error) => { console.log("db error insertBoss"); console.log(error); },
        (t, success) => { successFunc() }
    )
}

const dropUserBossesTableAsync = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'DROP TABLE ' + ALL_BOSSES_TABLE, [],
                (_, result) => { console.debug('Table dropped! (%s)', ALL_BOSSES_TABLE); resolve(result) },
                (_, error) => {
                    console.log("error dropping bosses table"); reject(error)
                }
            )
        })
    })
}

const dropAllBossesTableAsync = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'DROP TABLE ' + USER_BOSSES_TABLE, [],
                (_, result) => { console.debug('Table dropped! (%s)', USER_BOSSES_TABLE); resolve(result) },
                (_, error) => {
                    console.log("error dropping bosses table"); reject(error)
                }
            )
        })
    })
}

const setupAllBossesTableAsync = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS ' + ALL_BOSSES_TABLE + ' (boss_id integer primary key, boss_name text not null, death_count_array text not null);'
            );
        },
            (_, error) => { console.log("DATABASE ERROR: Couldn't create %s table.", ALL_BOSSES_TABLE); console.log(error); reject(error) },
            (_, success) => { console.log('Table setup completed. (%s)', ALL_BOSSES_TABLE); resolve(success) }
        )
    })
}

const setupUserBossesTableAsync = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS ' + USER_BOSSES_TABLE + ' (boss_id integer primary key, list_order integer not null, is_defeated text not null);'
            );
        },
            (_, error) => { console.log("DATABASE ERROR: Couldn't create %s table.", USER_BOSSES_TABLE); console.log(error); reject(error) },
            (_, success) => { console.log('Table setup completed. (%s)', USER_BOSSES_TABLE); resolve(success) }
        )
    })
}

const tableRowCount = (tableName, resultCallback) => {
    db.transaction(tx => {
        tx.executeSql(
            'SELECT COUNT(*) FROM ' + tableName + ';',
            [],
            (_, { rows: { _array } }) => {
                resultCallback(_array[0]['COUNT(*)'])
            });
    },
        (_, error) => { console.log('DATABASE ERROR: Couldn\'t complete query on %s table', tableName); console.log(error); },
        (_, success) => { }
    )
}

const setupBossesAsync = async () => {
    return new Promise((resolve, _reject) => {
        db.transaction(tx => {
            tx.executeSql("insert into " + ALL_BOSSES_TABLE + " (boss_id, boss_first_name, death_count_array) values (1,'Malenia, Blade of Miquella','[0]')");
        },
            (_, error) => { console.log("db error insertBoss"); console.log(error); resolve() },
            (_, success) => { resolve(success) }
        )
    })
}

export const DatabaseHelper = {
    getBosses,
    insertBoss,
    setupAllBossesTableAsync,
    setupUserBossesTableAsync,
    setupBossesAsync,
    dropAllBossesTableAsync,
    dropUserBossesTableAsync,
    tableRowCount
}