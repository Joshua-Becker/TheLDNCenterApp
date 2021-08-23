import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import {useTheme} from '../navigation/ThemeProvider';
import Spinner from 'react-native-loading-spinner-overlay';
import { Card, Title, Paragraph, Divider, Button } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { IconButton } from 'react-native-paper';
import Clipboard from '@react-native-community/clipboard';

export default function ResourcesScreen({ route, navigation }) {
    let {colors, isDark} = useTheme();
    const [numberOfResourcesFound, setNumberOfResourcesFound] = useState(0);
    const [loading, setLoading] = useState(false);
    const [filteredResources, setFilteredResources] = useState([]);

    function filterResources(){
        const category = route.params.category;
        const condition = route.params.condition;
        const filterType = route.params.filterType;
        let counter = 0;
        let retArray = [];
        for(resource of route.params.data){
            if(resource.category == category || category == ''){
                if(condition == '' || resource.data.tags != undefined || resource.data.tags.includes(condition)){
                    if(resource.filterType == filterType || filterType == ''){
                        if(resource.data.tags == undefined){
                            resource.data['tags'] = [];
                        } else {
                            resource.data.tags = resource.data.tags.join(' ');
                        }
                        retArray.push(resource);
                        counter += 1;
                    }
                }
            }
        }
        setFilteredResources(retArray);
        setNumberOfResourcesFound(counter);
    }
    
    async function saveResource(title, url){
        alert("Resource saved to your resources");
        await firestore()
        .collection('USERS').doc(userID).collection('RESOURCES').add({
            date: new Date().getTime(),
            from: 'Saved',
            link: url,
            title: title,
        });
    }

    useEffect(() => {
        setLoading(true);
        if(filteredResources.length == 0){
            filterResources();
        }
        setLoading(false);
    },[filteredResources]);

    return (
    <View style={styles(colors).container}>
        <ScrollView style={styles(colors).scrollContainer} scrollIndicatorInsets={{ right: 1 }}>
            <View style={styles(colors).content}>
                <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
                />
                <Text style={styles(colors).numberOfResourcesText}>{numberOfResourcesFound} Resources Found</Text>
                <Divider style={styles(colors).divider}></Divider>
                {
                    filteredResources.map(resource => {
                    return <Card style={styles(colors).card}>
                            <Card.Content key={resource.data.title}>
                                <Title style={styles(colors).cardSubTitle}>{resource.data.title}</Title>
                                <Divider style={styles(colors).divider}></Divider>
                                <Paragraph style={styles(colors).cardText}>{resource.category}</Paragraph>
                                <Paragraph style={styles(colors).cardText}>{resource.data.tags}</Paragraph>
                                <Paragraph style={styles(colors).cardText}>{resource.filterType}</Paragraph>
                            </Card.Content>
                            <Card.Actions style={styles(colors).cardButtons}>
                                <IconButton
                                    icon='link'
                                    size={30}
                                    color='#5DA8E7'
                                    onPress={() => Linking.openURL(resource.data.url)}
                                />
                                <IconButton
                                    icon='heart'
                                    size={30}
                                    color='#5DA8E7'
                                    onPress={() => saveResource(resource.data.title, resource.data.url)}
                                />  
                                <IconButton
                                    icon='arrow-right'
                                    size={30}
                                    color='#5DA8E7'
                                    onPress={() => saveResource(resource.data.title, resource.data.url)}
                                /> 
                            </Card.Actions>
                            </Card>;
                    })
                }
            </View>
        </ScrollView>
    </View>
    );
}

const styles = (colors) => StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
        justifyContent: 'space-between',
    },
    content: {
        margin: 20,
    },
    card: {
        width: '100%',
        backgroundColor: colors.backgroundShaded,
        marginBottom: 20,
    },
    cardTitle: {
        color: colors.text,
        fontWeight: 'bold',
    },
    cardSubTitle: {
        // marginTop: 20,
        marginBottom: 5,
        color: colors.text,
        fontSize: 18,
    },
    cardText: {
        color: colors.text,
    },
    divider: {
        borderWidth: 1,
        borderColor: colors.text,
        // marginLeft: 15,
        // marginRight: 15,  
        marginBottom: 10,    
    },
    numberOfResourcesText: {
        color: '#fff',
        fontSize: 30,
    },
    cardButtons: {
        justifyContent: 'space-between',
    },
});