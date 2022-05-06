import { AdMobBanner, setTestDeviceIDAsync } from 'expo-ads-admob'
import { purchaseItemAsync } from 'expo-in-app-purchases'
import { useEffect } from 'react'
import { ImageBackground, Pressable, StyleSheet, Text, Vibration, View } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'
import { AD_UNIT_ID, IAP_PRODUCT_ID, USER_PRIVILEGE_DB_KEY } from '../CONSTANTS'
import { useIap } from './IAPManager'

export default function AdComponent() {

    const [shouldRemoveAds, setRemoveAds] = useMMKVBoolean(USER_PRIVILEGE_DB_KEY)
    const { processing, setProcessing } = useIap()

    useEffect(() => {
        setTestDeviceIDAsync("EMULATOR");
    }, [])

    const removeAdsHandler = () => {
        Vibration.vibrate(100, false)
        const processPayment = async () => {
            if (processing)
                return
            setProcessing(true)
            try {
                await purchaseItemAsync(IAP_PRODUCT_ID)
            } catch (e) {
                setProcessing(false)
                console.log('AD-COMPONENT: Purchase failed!');
                console.log(e);
            }
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
                <Text style={styles.contribute}>REMOVE ADS / CONTRIBUTE</Text>
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