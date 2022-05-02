import { AdMobBanner, setTestDeviceIDAsync } from 'expo-ads-admob'
import { getPurchaseHistoryAsync, purchaseItemAsync } from 'expo-in-app-purchases'
import { useEffect } from 'react'
import { ImageBackground, Pressable, Text, View } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'
import { AD_UNIT_ID, IAP_PRODUCT_ID, USER_PRIVILEGE_DB_KEY } from '../CONSTANTS'
import { useIap } from './IAPManager'

export default function AdComponent() {

    const [shouldRemoveAds, setRemoveAds] = useMMKVBoolean(USER_PRIVILEGE_DB_KEY)
    const { processing, setProcessing } = useIap()

    useEffect(() => {
        setTestDeviceIDAsync("EMULATOR");
    }, [])

    useEffect(() => {
        if (shouldRemoveAds)
            return
        checkPurchaseHistoryAndUpdate()

    }, [])

    const checkPurchaseHistoryAndUpdate = async () => {
        const { IAPResponseCode, results } = await getPurchaseHistoryAsync()
        if (IAPResponseCode == 0 && results.length == 1) {
            if (results[0].productId == IAP_PRODUCT_ID)
                setRemoveAds(true)
        }
    }

    const removeAdsHandler = () => {
        Vibration.vibrate(100, false)
        const processPayment = async () => {
            if (processing)
                return
            setProcessing(true)
            purchaseItemAsync(IAP_PRODUCT_ID)
        }
        processPayment();
    }

    return (!shouldRemoveAds && <View style={[styles.alignCenter, styles.fullWidth]}>
        <Pressable onPress={removeAdsHandler} style={[styles.contributeContainer, styles.alignCenter]}>
            <ImageBackground
                style={[styles.fullWidth, styles.alignCenter]}
                imageStyle={styles.alignCenter}
                resizeMode={'stretch'}
                source={require('../assets/count-glow-2.png')}
            >
                <Text style={styles.contribute}>CONTRIBUTE / REMOVE ADS</Text>
            </ImageBackground>
        </Pressable>
        <AdMobBanner
            bannerSize='banner'
            adUnitID={AD_UNIT_ID}
            servePersonalizedAds // true or false
            onDidFailToReceiveAdWithError={(e) => console.log(e)}
        />
    </View>)
}

const styles = StyleSheet.create({
    fullWidth: {
        width: '100%',
    },
    alignCenter: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    contributeContainer: {
        marginBottom: 15,
        width: '100%'
    },
    contribute: {
        fontFamily: 'RomanAntique',
        color: 'rgb(243,211,158)',
        textShadowColor: 'rgb(243,211,158)',
        textShadowRadius: 15
    }
})