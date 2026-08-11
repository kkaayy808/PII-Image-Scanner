import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Image, ScrollView, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
    
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {

        const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setResult(null);
    }
};

    const uploadImage = async () => {

        if (!image) return;

        setLoading(true);

    //console.log("UPLOAD BUTTON PRESSED");

        const formData = new FormData();

        formData.append('image', {
          uri: image,
          name: 'photo.jpg',
           type: 'image/jpeg'
         });

        try {
            //console.log("SENDING REQUEST...");

            const response = await fetch('https://profane-swerve-subdivide.ngrok-free.dev/upload', {
                method: 'POST',
                body: formData
            });

            //console.log("RESPONSE RECEIVED");
    
            const data = await response.json();

            //console.log("DATA:", data);

            setResult(data);

         } catch (error) {
            console.log("UPLOAD ERROR:", error);
         }

        setLoading(false);
    };

    const getRiskColor = (score) => {
        if (score <= 3) return '#2ECC71';
        if (score <= 6) return '#F39C12';
        return '#E74C3C';
    };

    return (

        <SafeAreaView style={styles.safeArea}>

            <ScrollView contentContainerStyle={styles.container}>

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>PII Image Scanner</Text>
                </View>


                <Text style={styles.subtitle}>Detect sensitive information before sharing images</Text>


                {/*<View style={styles.section}>*/}
                {/*    <Button title="Select Image" onPress={pickImage} />*/}
                {/*</View>*/}

                <TouchableOpacity style={styles.primaryButton} onPress={pickImage}>
                    <Text style={styles.buttonText}>Select Image</Text>
                </TouchableOpacity>


                {image && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>IMAGE PREVIEW</Text>
                        <Image source={{ uri: image }} style={styles.image} />

                        {/*<View style={styles.scanButton}>*/}
                        {/*    <Button title="Scan Image" onPress={uploadImage} />*/}
                        {/*</View>*/}

                        <TouchableOpacity style={styles.secondaryButton} onPress={uploadImage}>
                            <Text style={styles.buttonText}>Scan Image</Text>
                        </TouchableOpacity>

                    </View>
                )}


                {loading && (
                    <View style={styles.section}>
                        <ActivityIndicator size="large" />
                        <Text style={styles.loadingText}>Scanning image...</Text>
                    </View>
                )}


                {result && (
                    <View style={styles.results}>
                        <Text style={styles.sectionTitle}>SCAN RESULTS</Text>

                        <View style={styles.riskContainer}>
                            <Text style={styles.riskLabel}>Risk Level</Text>
                            <View style={[styles.riskBadge,
                                { backgroundColor: getRiskColor(result.riskScore)}
                                ]}
                            >
                                <Text style={styles.riskText}>
                                    {result.riskScore} / 10
                                </Text>
                            </View>
                        </View>

                    {/*<Text style={styles.heading}>Risk Score:</Text>*/}
                        {/*<Text>{result.riskScore}</Text>*/}

                        {/*<Text style={styles.resultsHeading}>Detected PII</Text>*/}
                        {/*{result.pii && result.pii.length > 0 ? (*/}
                        {/*    result.pii.map((item, index) => (*/}
                        {/*        <Text key={index} style={styles.piiItem}>*/}
                        {/*            • {item}*/}
                        {/*        </Text>*/}
                        {/*    )) */}
                        {/*) : (*/}
                        {/*        <Text style={styles.noneDetected}>No sensitive information detected</Text>*/}
                        {/*)} */}

                        {/*<Text style={styles.resultsHeading}>Extracted Text</Text>*/}
                        {/*<Text style={styles.extractedText}>{result.text || "No text detected"}</Text>*/}

                        <Text style={styles.resultsHeading}>Detected PII</Text>

                        {result.pii && (
                            <>
                                {result.pii.emails?.length > 0 && (
                                    <Text style={styles.piiItem}>
                                        • Email Address ({result.pii.emails.length})
                                    </Text>
                                )}

                                {result.pii.phoneNumbers?.length > 0 && (
                                    <Text style={styles.piiItem}>
                                        • Phone Number ({result.pii.phoneNumbers.length})
                                    </Text>
                                )}

                                {result.pii.ssns?.length > 0 && (
                                    <Text style={styles.piiItem}>
                                        • Social Security Number ({result.pii.ssns.length})
                                    </Text>
                                )}

                                {result.pii.emails?.length === 0 &&
                                    result.pii.phoneNumbers?.length === 0 &&
                                    result.pii.ssns?.length === 0 && (
                                        <Text style={styles.noneDetected}>
                                            No sensitive information detected
                                        </Text>
                                    )}
                            </>
                        )}

                        <Text style={styles.resultsHeading}>Extracted Text</Text>

                        <Text style={styles.extractedText}>
                            {result.text
                                ? result.text.replace('---', '\n\n')
                                : "No text detected"}
                        </Text>

                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        backgroundColor: '#F5F7FA'
    },

    container: {
        //flexGrow: 1,
        alignItems: 'center',
        //justifyContent: 'center',
        padding: 25,
        backgroundColor: '#F5F7FA'
    },

    title: {
        fontSize: 26,
        marginBottom: 5,
        fontWeight: 'bold',
        color: '#2C3E50',
        textAligh: 'center'
    },

    subtitle: {
        fontSize: 14,
        color: '#7F8C8D',
        marginBottom: 30,
        textAlign: 'center'
    },

    section: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 25
    },

    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 10
    },

    image: {
        width: 300,
        height: 300,
        borderRadius: 10,
        marginBottom: 15,
    },

    scanButton: {
        width: '60%'
    },

    loadingText: {
        marginTop: 10,
        color: '#7F8C8D'
    },

    results: {
        width: '100%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3
    },

    riskContainer: {
        alignItems: 'center',
        marginBottom: 20
    },

    riskLabel: {
        fontSize: 14,
        color: '#7F8C8D',
        marginBottom: 8
    },

    riskBadge: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20
    },

    riskText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },

    resultsHeading: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 10,
        marginBottom: 6,
        color: '#2C3E50'
    },

    piiItem: {
        fontSize: 14,
        marginBottom: 3,
        color: '#34495E'
    },

    noneDetected: {
        color: '#7F8C8D'
    },

    extractedText: {
        marginTop: 5,
        color: '#34495E',
        lineHeight: 20
    },

    header: {
        width: "100%",
        backgroundColor: "#FFA8B8",
        paddingVertical: 18,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4
    },

    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "black"
    },

    primaryButton: {
        backgroundColor: "#FFEFA8",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
    },

    secondaryButton: {
        backgroundColor: "#FFEFA8",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginTop: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
    },

    buttonText: {
        color: "black",
        fontWeight: "bold",
        fontSize: 16
    }

});