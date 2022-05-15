import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from 'anonymous-files';

export default function App() {

    let [selectedImage, setSelectedImage] = React.useState(null);

    let openImagePickerAsync = async () => {

        // Deprecated
        // let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();


        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.cancelled === true) {
            return;
        }

        if (Platform.OS === 'web') {
            let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
            setSelectedImage({ localUri: pickerResult.uri, remoteUri });
        } else {
            setSelectedImage({ localUri: pickerResult.uri, remoteUri: null });
        }
    };

    let openShareDialogAsync = async () => {

        /*
        if (Platform.OS === 'web') {
            alert(`Uh oh, sharing isn't available on your platform`);
            return;
        }
        */

        if (!(await Sharing.isAvailableAsync())) {
            alert(`The image is available for sharing at: ${selectedImage.remoteUri}`);
            return;
        }

        Sharing.shareAsync(selectedImage.remoteUri || selectedImage.localUri);
    };

    if (selectedImage !== null) {
        return (
            <View style={styles.container}>
                <Image source={{ uri: selectedImage.localUri }} style={styles.thumbnail} />
                <br/>
                <TouchableOpacity onPress={openShareDialogAsync} style={styles.button}>
                    <Text style={styles.buttonText}>Share this photo</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Image source={{ uri: 'https://i.imgur.com/TkIrScD.png' }} style={styles.logo} />
            <br/>
            <Text style={styles.instructions}>
                To share a photo from your phone with a friend, just press the button below!
            </Text>
            <br/>
            <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
                <Text style={styles.buttonText}>Pick a photo</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 305,
        height: 159,
        marginBottom: 20,
    },
    instructions: {
        color: '#888',
        fontSize: 18,
        marginHorizontal: 15,
        marginBottom: 10,
    },
    button: {
        backgroundColor: 'blue',
        padding: 20,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 20,
        color: '#fff',
    },
    thumbnail: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
    }
});
