import React from 'react';
import { View, StyleSheet, Image, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/theme';
import { TouchableOpacity } from 'react-native-gesture-handler';

const win = Dimensions.get('window');

const styles = StyleSheet.create({
    safeAreacontainer: {
        flex: 1,
        width: win.width,
        backgroundColor: '#000'
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000'
    },
    imageContainer: {
        height: win.height,
        width: win.width,
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    headerContainer: {
        top: 0,
        position: 'absolute',
        zIndex: 99,
        alignItems: 'flex-start',
        height: 40,
        width: win.width,
    },
    backIconContainer: {
        marginLeft: 12,
    },
    backIcon: {
        lineHeight: 40,
        textAlign: 'center',
        alignSelf: 'flex-start',
        color: '#fff',
        flex: 1,
    }
})

export function ShowImage(props) {
    const [imageData, setImageData] = React.useState<any[]>([]);

    // set image data after navigate from map screen
    function getImageData() {
        const { params } = props.route;
        setImageData(params.selectedImage);
    }

    React.useEffect(() => {
        props.navigation.addListener('focus', getImageData);

        return () => {
            props.navigation.removeListener('focus', getImageData)
        }
    }, [])

    return (
        <SafeAreaView style={styles.safeAreacontainer}>
            {/* {console.log(imageData)} */}
            <View style={styles.bodyContent}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.backIconContainer} onPress={() => props.navigation.goBack()}>
                        <Ionicons name="ios-arrow-back" size={28} style={styles.backIcon} />
                    </TouchableOpacity>
                </View>
                {imageData !== []
                    &&
                    <>
                        <ActivityIndicator size="large" style={{ alignSelf: 'center', justifyContent: 'center', position: 'absolute' }} />
                        <Image source={{ uri: imageData.url }} style={styles.imageContainer} />
                    </>
                }
            </View>
        </SafeAreaView>
    )

}