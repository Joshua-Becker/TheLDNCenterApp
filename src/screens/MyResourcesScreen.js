import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import {useTheme} from '../navigation/ThemeProvider';
import NavFooter from '../components/NavFooter';
import { Card, Title, Paragraph, Divider, Button } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { IconButton } from 'react-native-paper';

export default function MyResourcesScreen({ navigation }) {
    let {colors, isDark} = useTheme();
    const [savedResources, setSavedResources] = useState([]);
    const [teamResources, setTeamResources] = useState([]);
    const [resourcesTitlesIds, setResourcesTitlesIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toggleSavedResources, setToggleSavedResources] = useState(false);
    const [toggleTeamResources, setToggleTeamResources] = useState(false);
    const user = auth().currentUser;

    function handleToggle(toggleType) {
        if(toggleType == 'Saved') {
            if(toggleSavedResources){
                setToggleSavedResources(false);
            } else {
                setToggleSavedResources(true);
            }
        } else {
            if(toggleTeamResources){
                setToggleTeamResources(false);
            } else {
                setToggleTeamResources(true);
            } 
        }
    }

    async function getMyResources(){
        await firestore()
        .collection('USERS').doc(user.uid).collection('RESOURCES').limit(1000).get().then(data => {
            data.forEach(doc => {
                if(doc.data().from == 'Saved') {
                    setSavedResources(oldArray => [...oldArray, doc.data()]);
                }
                else {
                    setTeamResources(oldArray => [...oldArray, doc.data()]);
                }
                setResourcesTitlesIds(oldArray => [...oldArray, [doc.id,doc.data().title]]);
            })
        }).then( data => {
            setLoading(false);
        });
    }

    function removeResourceHandler(resource){
        Alert.alert(
            "Removing Resource",
            "Are you sure you want to remove this resource from your resources?",
            [
              {
                text: "Cancel",
                onPress: () => {},
                style: "cancel"
              },
              { text: "Yes", onPress: () => removeResource(resource) }
            ],
            { cancelable: false }
        );
    }

    async function removeResource(resource) {
        if(resource.from == 'Saved'){
            setSavedResources(savedResources.filter(item => item.title !== resource.title));
        } else {
            setTeamResources(teamResources.filter(item => item.title !== resource.title));
        }

        resourcesTitlesIds.forEach(async pair => {
            if(pair[1] == resource.title){
                await firestore().collection('USERS').doc(user.uid).collection('RESOURCES')
                .doc(pair[0]).delete();
            }
        })
    }

    useEffect(() => {
        setLoading(true);
        if(savedResources.length == 0 && teamResources.length == 0){
            getMyResources();
        } else {
            setLoading(false);
        }
    }, [savedResources, teamResources]);

    return (
    <View style={styles(colors).container}>
        <Spinner
          visible={loading}
          textContent={'Loading...'}
          textStyle={styles(colors).spinnerTextStyle}
          color={'white'}
        />
        <ScrollView>
            <View style={styles(colors).content}>
                <View style={styles(colors).headerBox}>
                    <Text style={styles(colors).title}>Sent From My Team</Text>
                    {
                        toggleTeamResources ? 
                        <IconButton
                            icon='chevron-down'
                            size={50}
                            color='#5DA8E7' 
                            onPress={() => handleToggle('Team')}
                            style={styles(colors).dropdownChevron}
                        />
                        :
                        <IconButton
                            icon='chevron-right'
                            size={50}
                            color='#5DA8E7' 
                            onPress={() => handleToggle('Team')}
                            style={styles(colors).dropdownChevron}
                        />

                    }
                </View>
                    { 
                        teamResources.map(resource => {
                        return <Card style={styles(colors).card} key={resource.title}>
                                <Card.Content>
                                    <Title style={styles(colors).cardSubTitle}>{resource.title}</Title>
                                </Card.Content>
                                <Card.Actions style={styles(colors).cardButtons}>
                                    {/* <IconButton
                                        icon='link'
                                        size={30}
                                        color='#5DA8E7' 
                                        onPress={() => copyToClipboard(resource.link)}
                                    /> */}
                                    <Button color='#1f65a6' onPress={() => copyToClipboard(resource.data.url)}>Copy Link</Button>
                                    {/* <IconButton
                                        icon='arrow-right'
                                        size={30}
                                        color='#5DA8E7'
                                        onPress={() => Linking.openURL(resource.link)}
                                    />  */}
                                    <Button color='#1f65a6' onPress={() => Linking.openURL(resource.data.url)}>View</Button>
                                    {/* <IconButton
                                        icon='close'
                                        size={30}
                                        color='#5DA8E7'
                                        onPress={() => removeResourceHandler(resource)}
                                    />  */}
                                    <Button color='#1f65a6' onPress={() => removeResourceHandler(resource)}>Close</Button>
                                </Card.Actions>
                                </Card>;
                        })
                    }
                <View style={styles(colors).headerBox}>
                    <Text style={styles(colors).title}>My Saved Resources</Text>
                    {
                        toggleSavedResources ? 
                        <IconButton
                            icon='chevron-down'
                            size={50}
                            color='#5DA8E7' 
                            onPress={() => handleToggle('Saved')}
                            style={styles(colors).dropdownChevron}
                        />
                        :
                        <IconButton
                            icon='chevron-right'
                            size={50}
                            color='#5DA8E7' 
                            onPress={() => handleToggle('Saved')}
                            style={styles(colors).dropdownChevron}
                        />

                    }
                </View>
                    {
                        toggleSavedResources ? savedResources.map(resource => {
                        return <Card style={styles(colors).card} key={resource.title}>
                                <Card.Content>
                                    <Title style={styles(colors).cardSubTitle}>{resource.title}</Title>
                                </Card.Content>
                                <Card.Actions style={styles(colors).cardButtons}>
                                    {/* <IconButton
                                        icon='link'
                                        size={30}
                                        color='#5DA8E7' 
                                        onPress={() => copyToClipboard(resource.link)}
                                    /> */}
                                    <Button color='#1f65a6' onPress={() => copyToClipboard(resource.data.url)}>Copy Link</Button>
                                    {/* <IconButton
                                        icon='arrow-right'
                                        size={30}
                                        color='#5DA8E7'
                                        onPress={() => Linking.openURL(resource.link)}
                                    />  */}
                                    <Button color='#1f65a6' onPress={() => Linking.openURL(resource.data.url)}>View</Button>
                                    {/* <IconButton
                                        icon='close'
                                        size={30}
                                        color='#5DA8E7'
                                        onPress={() => removeResourceHandler(resource)}
                                    />  */}
                                    <Button color='#1f65a6' onPress={() => removeResourceHandler(resource)}>Close</Button>
                                </Card.Actions>
                                </Card>;
                        }) : <View></View>
                    }
            </View>
        </ScrollView>
        <NavFooter
          navigation={navigation}
          destA='About'
          destB='Resources'
          destC=''
          iconA='card-account-details'
          iconB='bookshelf'
          iconC='content-save'
          />
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
        width: '100%',
        padding: 20,
        alignItems: 'center',
    },
    card: {
        width: '100%',
        backgroundColor: colors.backgroundShaded,
        marginBottom: 20,
    },
    cardTitle: {
        color: colors.text,
    },
    cardSubTitle: {
        color: colors.text,
    fontSize: 18,
    },
    cardText: {
        color: colors.text,
    },
    divider: {
        borderWidth: 1,
        borderColor: colors.text,
        //width: '100%',
    },
    spinnerTextStyle: {
        color: 'white'
    },
    title: {
        fontSize: 25,
        color: 'white',
        textAlign: 'center',
    },
    cardButtons: {
        justifyContent: 'space-between',
    },
    headerBox: {
        //width: '100%',
        // marginBottom: 10,
        // marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
        backgroundColor: '#1F2232',
        borderRadius: 50,
        margin: 10,
        paddingLeft: 20,
    },
    dropdownChevron: {
    }
});