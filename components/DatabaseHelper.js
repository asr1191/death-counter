import React from 'react'

import * as SQLite from "expo-sqlite"

const db = SQLite.openDatabase('db.db')

const TABLE_NAME = "bosses"

const getBosses = (setBossesCallback) => {
    db.transaction(
        tx => {
            tx.executeSql(
                'select * from ?',
                [TABLE_NAME],
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
        tx.executeSql('insert into ? (boss_first_name, boss_last_name, death_count_array) values (?, ?, ?)', [TABLE_NAME, bossFirstName, bossLastName, deathCountArray]);
    },
        (t, error) => { console.log("db error insertBoss"); console.log(error); },
        (t, success) => { successFunc() }
    )
}

const dropDatabaseTablesAsync = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'drop table ' + TABLE_NAME, [],
                (_, result) => { resolve(result) },
                (_, error) => {
                    console.log("error dropping bosses table"); reject(error)
                }
            )
        })
    })
}

const setupDatabaseAsync = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'create table if not exists ' + TABLE_NAME + ' (boss_id integer primary key, boss_first_name text not null, boss_last_name text, death_count_array text not null);'
            );
        },
            (_, error) => { console.log("db error creating tables"); console.log(error); reject(error) },
            (_, success) => { resolve(success) }
        )
    })
}

const setupBossesAsync = async () => {
    return new Promise((resolve, _reject) => {
        db.transaction(tx => {
            tx.executeSql("insert into " + TABLE_NAME + " (boss_id, boss_first_name, boss_last_name, death_count_array) values (1,'Malenia,','Blade of Miquella','[0]')");
        },
            (t, error) => { console.log("db error insertBoss"); console.log(error); resolve() },
            (t, success) => { resolve(success) }
        )
    })
}

export const DatabaseHelper = {
    getBosses,
    insertBoss,
    setupDatabaseAsync,
    setupBossesAsync,
    dropDatabaseTablesAsync,
}