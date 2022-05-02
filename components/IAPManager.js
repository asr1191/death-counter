/* This is boilerplate code for a sample in-app purchase implementation for 
React Native, using `expo-in-app-purchases`.

The full walkthrough article can be found here: 
https://rossbulat.medium.com/in-app-purchases-and-subscriptions-in-react-native-2021-walkthrough-26d2056e1a27

The IAPManager component initiates a purchase event listener and connects to 
the store in question (App Store or Google Play). It provides a context to 
child components allowing any child component to request a purchase.
*/

import React, { useState, useEffect } from 'react'
import * as InAppPurchases from 'expo-in-app-purchases'
import { useMMKVBoolean } from 'react-native-mmkv'
import { IAP_PRODUCT_ID } from '../CONSTANTS';


// define your in-app purchase SKUs 
// for both App Store and Google Play.
const IAP_SKUS = [
    IAP_PRODUCT_ID,
]

// define a context to host your IAP functionality
// processing: boolean. Reflects whether a purchase is currently in progress
// setProcessing: allows child components to update processing state
// getProducts: a wrapper function that calls expo-in-app-purchase method getProductsAsync()
export const IAPContext = React.createContext({
    processing: false,
    setProcessing: () => { },
    getProducts: () => { },
});


// define a useContext hook for functional components
export const useIap = () => React.useContext(IAPContext);


// IAPManagerWrapped 
export const IAPManagerWrapped = (props) => {

    const [processing, setProcessing] = useState(false);
    const [shouldRemoveAds, setRemoveAds] = useMMKVBoolean('premium')


    // app logic to process a subscription
    // this is not a part of expo-in-app-purchases, but handles
    // your own app / server-side logic for processing a new 
    // purchase or subscription.

    // this entire function can be amended to meet your own
    // requirements, but demonstrates some common conventions
    // when processing an in-app purchase.
    const processNewPurchase = async (purchase) => {
        setRemoveAds(true)
    }


    // getProducts
    // calls getProductsAsync and returns the results.
    // returns an empty array if call fails. 
    const getProducts = async () => {
        const { responseCode, results } = await InAppPurchases.getProductsAsync(IAP_SKUS);
        if (responseCode === InAppPurchases.IAPResponseCode.OK) {
            return results;
        } else {
            console.log('IAP-MANAGER: Failed to get products');
            return [];
        }
    }


    // initIAPandEventListeners
    // connects to the store of the platform (App Store or Google Play)
    // and defined an event listener for processing purchase
    // requests, both for one-time purchases and subscriptions
    const initIAPandEventListeners = async () => {

        // connect to store if not done so already
        try {
            await InAppPurchases.connectAsync();
        } catch (e) { /* already connected, verify error with `e` */ }


        // purchase listener. Most of this is boilerplate from the official docs, with a 
        // couple of additions to process a purchase and stop processing.
        InAppPurchases.setPurchaseListener(({ responseCode, results, errorCode }) => {

            // Purchase was successful
            if (responseCode === InAppPurchases.IAPResponseCode.OK) {
                results.forEach(async (purchase) => {
                    if (!purchase.acknowledged) {

                        // process transaction here and unlock content
                        // !! This is your own logic that is not a part of expo-in-app-purchases.
                        // any processing that needs to be done within your app or on your server
                        // can be executed here, just before finishTransactionAsync
                        await processNewPurchase(purchase);

                        // finish the transaction on platform's end
                        InAppPurchases.finishTransactionAsync(purchase, false);
                    }
                });

                // handle particular error codes
            } else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
                console.log('User canceled the transaction');
            } else if (responseCode === InAppPurchases.IAPResponseCode.DEFERRED) {
                console.log('User does not have permissions to buy but requested parental approval (iOS only)');
            } else {
                console.warn(`Something went wrong with the purchase. Received errorCode ${errorCode}`);
            }

            // stop processing. This state update should be reflected
            // in your components. E.g. make IAPs accessible again.
            setProcessing(false);
        });
    }


    // when the component first renders, initiate
    // your purchase event listeners
    useEffect(() => {
        initIAPandEventListeners();
    }, []);


    // plug rhe values and functions into your
    // context that will be accessible to all
    // props.children
    return (
        <IAPContext.Provider value={{
            processing: processing,
            setProcessing: setProcessing,
            getProducts: getProducts,
        }}>
            {props.children}
        </IAPContext.Provider>
    );
}

export default IAPManager;