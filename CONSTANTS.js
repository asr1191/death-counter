function _initItemArray(maxNumber) {
    console.log('POPULATING COUNTER LIST YOOOOOOOOOOOOOOOOOOOO');
    const items = [];
    for (let index = 0; index < maxNumber; index++) {
        items.push({
            id: index,
            title: index.toString(),
        });
    }
    return items;
}
export const IAP_PRODUCT_ID = 'remove_ads';
export const USER_PRIVILEGE_DB_KEY = 'premium';
export const BOSSES_DB_KEY = 'bosses_list';
export const BOSSES_ID_KEY = 'latest_id';
// export const AD_UNIT_ID = 'ca-app-pub-3940256099942544/6300978111'  // Test Ad
export const AD_UNIT_ID = 'ca-app-pub-4755365405967473/4696849754'; // Production ad
export const MAX_DEATH = 501;
export const ITEM_HEIGHT = 200;
export const ITEM_ARRAY = _initItemArray(MAX_DEATH);

export default {
    IAP_PRODUCT_ID,
    USER_PRIVILEGE_DB_KEY,
    BOSSES_DB_KEY,
    BOSSES_ID_KEY,
    AD_UNIT_ID,
    MAX_DEATH,
    ITEM_HEIGHT,
    ITEM_ARRAY,
};
