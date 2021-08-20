import React, { useEffect, useContext, useState } from 'react';
import {ScrollView, View, StatusBar, Text, StyleSheet, Switch, Alert} from 'react-native';
import {useTheme} from '../navigation/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../navigation/AuthProvider';
import { EThree } from '@virgilsecurity/e3kit-native';

export default function SettingsScreen(props) {
    const { user, ethree, auditLog } = useContext(AuthContext);
    const currentUser = user.toJSON();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [newPass, setNewPass] = useState('');
    const [oldPass, setOldPass] = useState('');
    const [condition, setCondition] = useState('');
    const [painLevel, setPainLevel] = useState(-1);
    const [symptomTimeline, setSymptomTimeline] = useState('');
    const [medications, setMedications] = useState('');
    const [comments, setComments] = useState('');
    const [originalPhone, setOriginalPhone] = useState('');
    const [originalCondition, setOriginalCondition] = useState('');
    const [originalPainLevel, setOriginalPainLevel] = useState(0);
    const [originalSymptomTimeline, setOriginalSymptomTimeline] = useState('');
    const [originalMedications, setOriginalMedications] = useState('');
    const [originalComments, setOriginalComments] = useState('');
    const {children} = props;

    //props.navigation.setParams({ backgroundColor: '#ccc' })
    // Using the custom hook we made to pull the theme colors
    let {colors, isDark} = useTheme();
    const {setScheme} = useTheme();
    const toggleScheme = () => {
        /*
        * setScheme will change the state of the context
        * thus will cause childrens inside the context provider to re-render
        * with the new color scheme
        */
        isDark ? setScheme('light') : setScheme('dark');
        storeColorSceme(!isDark);
    }

    // Alert put into a promise to be called asynchronously (Pause JS flow)
    const AsyncAlert = (title, msg) => new Promise((resolve) => {
        Alert.alert(
        title,
        msg,
        [
            {
            text: 'ok',
            onPress: () => {
                resolve('YES');
            },
            },
        ],
        { cancelable: false },
        );
    });

    async function storeColorSceme(isDark) {
        try {
            if(isDark){
                AsyncStorage.setItem('@color_theme', 'dark');
            } else {
                AsyncStorage.setItem('@color_theme', 'light');
            }
        } catch (e) {
            console.log('[SettingScreen] Error saving settings: ' + e);
        }
    }

    async function getUserData() {
        const snapshot = await firestore()
        .collection('USERS')
        .doc(currentUser.uid)
        .get();
        const data = snapshot.data()
        setName(currentUser.displayName);
        setEmail(currentUser.email);
        setPhone(currentUser.phone);
        setCondition(data.user.condition);
        setComments(data.user.comments);
        setMedications(data.user.medications);
        setSymptomTimeline(data.user.symptomTimeline);
        setPainLevel(data.user.painLevel)
        setOriginalPhone(data.user.phone);
        setOriginalCondition(data.user.condition);
        setOriginalComments(data.user.comments);
        setOriginalMedications(data.user.medications);
        setOriginalSymptomTimeline(data.user.symptomTimeline);
        setOriginalPainLevel(data.user.painLevel)
    }

    function ethreeDerivedToStr(array) {
        let out = '';
        for (const num of array) {
          out += num.toString();
        }
        return out;
    }

    function deriveE3BackupPass(pass) {
        const { loginPassword, backupPassword } = EThree.derivePasswords(pass);
        return ethreeDerivedToStr(backupPassword);
    }

    async function saveSettings(){
        await firestore()
        .collection('USERS')
        .doc(currentUser.uid)
        .set({
            user: {
                phone: phone === '' ? originalPhone : phone,
                condition: condition === '' ? originalCondition : condition,
                painLevel: painLevel === -1 ? originalPainLevel : painLevel,
                symptomTimeline: symptomTimeline === '' ? originalSymptomTimeline : symptomTimeline,
                medications: medications === '' ? originalMedications : medications,
                comments: comments === '' ?  originalComments : comments,
            },
          }, { merge: true });
        AsyncAlert('Settings saved', 'Your information has been updated!');
        if(newPass != '' && oldPass != ''){
            //const oldBackupPassword = deriveE3BackupPass(oldPass);
            //const newBackupPassword = deriveE3BackupPass(newPass);
            //await ethree.changePassword(oldBackupPassword, newBackupPassword);
            await user.updatePassword(newPass);
        }
        auditLog(currentUser.uid, 'Adjusted settings');
        props.navigation.goBack();
    }

    useEffect(() => {
        getUserData();
        if(isDark){
            props.navigation.setOptions({
                headerStyle: {
                    backgroundColor: colors.navBar,
                },
            });
        } else {
            props.navigation.setOptions({
                headerStyle: {
                    backgroundColor: colors.navBar,
                    },
            });
        }
    }, [isDark]);

    return (
        <ScrollView style={styles(colors).scrollContainer}>
            {/* We can also use the isDark prop to set the statusbar style accordingly */}
            <StatusBar 
                barStyle={isDark ? "light-content" : "light-content"} 
                backgroundColor={isDark? colors.statusBar : colors.statusBar}/>
            <View style={styles(colors).container}>
                {children}
                <View style={[styles(colors).listItemToggle, styles(colors).listItemStart]}>
                    <Text style={styles(colors).text}>{isDark ? "Dark Mode" : "Light Mode"}</Text>
                    <Switch value={isDark} onValueChange={toggleScheme}/>
                </View>
                <View style={styles(colors).listItem}>
                    <View style={styles(colors).textContainer}>
                        <Text style={styles(colors).text}>Name:</Text>
                        <Text style={styles(colors).userValues}>{name}</Text>
                    </View>
                    <View style={styles(colors).textContainer}>
                        <Text style={styles(colors).text}>Email:</Text>
                        <Text style={styles(colors).userValues}>{email}</Text>
                    </View>
                </View>
                <View style={styles(colors).listItem}>
                    <View style={styles(colors).textContainer}>
                        <Text style={styles(colors).text}>Set new password</Text>
                    </View>
                    <FormInput
                    labelName="Old password"
                    style={styles(colors).formInput}
                    autoCapitalize='none'
                    onChangeText={userOldPass => setOldPass(userOldPass)}
                    />
                    <FormInput
                    labelName="New password"
                    style={styles(colors).formInput}
                    autoCapitalize='none'
                    onChangeText={userNewPass => setNewPass(userNewPass)}
                    />
                </View>
                <View style={styles(colors).listItem}>
                    <View style={styles(colors).textContainer}>
                        <Text style={styles(colors).text}>Phone:</Text>
                        <Text style={styles(colors).userValues}>{originalPhone}</Text>
                    </View>
                    <FormInput
                    labelName="Change field"
                    style={styles(colors).formInput}
                    autoCapitalize='none'
                    onChangeText={userPhone => setPhone(userPhone)}
                    />
                </View>
                <View style={styles(colors).listItem}>
                    <View style={styles(colors).textContainer}>
                        <Text style={styles(colors).text}>Condition:</Text>
                        <Text style={styles(colors).userValues}>{originalCondition}</Text>
                    </View>
                    <FormInput
                    labelName="Change field"
                    style={styles(colors).formInput}
                    autoCapitalize='none'
                    onChangeText={userCondition => setCondition(userCondition)}
                    />
                </View>
                <View style={styles(colors).listItem}>
                    <View style={styles(colors).textContainer}>
                        <Text style={styles(colors).text}>Medications:</Text>
                        <Text style={styles(colors).userValues}>{originalMedications}</Text>
                    </View>
                    <FormInput
                    labelName="Change field"
                    style={styles(colors).formInput}
                    autoCapitalize='none'
                    onChangeText={userMedications => setMedications(userMedications)}
                    />
                </View>
                <View style={styles(colors).listItem}>
                    <View style={styles(colors).textContainer}>
                        <Text style={styles(colors).text}>Symptom Timeline:</Text>
                        <Text style={styles(colors).userValues}>{originalSymptomTimeline}</Text>
                    </View>
                    <FormInput
                    labelName="Change field"
                    style={styles(colors).formInput}
                    autoCapitalize='none'
                    onChangeText={userTimeline => setSymptomTimeline(userTimeline)}
                    />
                </View>
                <View style={styles(colors).listItem}>
                    <View style={styles(colors).textContainer}>
                        <Text style={styles(colors).text}>Starting Pain Level:</Text>
                        <Text style={styles(colors).userValues}>{JSON.stringify(originalPainLevel)}</Text>
                    </View>
                    <FormInput
                    labelName="Change field"
                    style={styles(colors).formInput}
                    autoCapitalize='none'
                    onChangeText={userPainLevel => setPainLevel(parseInt(userPainLevel))}
                    />
                </View>
                <View style={styles(colors).listItem}>
                    <View style={styles(colors).textContainer}>
                        <Text style={styles(colors).text}>Comments:</Text>
                        <Text style={styles(colors).userValues}>{originalComments}</Text>
                    </View>
                    <FormInput
                    labelName="Change field"
                    multiline
                    style={styles(colors).formInput}
                    autoCapitalize='none'
                    onChangeText={userComments => setComments(userComments)}
                    />
                </View>
                <FormButton
                    title='Save Changes'
                    modeValue='contained'
                    onPress={() => {
                        console.log("Saving changes...")
                        saveSettings();
                        getUserData();
                    }
                    }
                />
            </View>
        </ScrollView>
    );
}

const styles = (colors) => StyleSheet.create({
    container: {
        // alignItems: 'center',
        padding: 20,
        /* 
        * the colors.background value will change dynamicly with
        * so if we wanna change its value we can go directly to the pallet
        * this will make super easy to change and maintain mid or end project
        */
        backgroundColor: colors.background,
    },
    scrollContainer: {
        backgroundColor: colors.background,
    },
    listItem: {
        flexDirection: 'column',
        //justifyContent: 'flex-start',
        //alignSelf: 'flex-start',
        borderBottomWidth: 0.5,
        paddingTop: 10,
        paddingBottom: 10,
        borderColor: colors.text,
        marginBottom: 30,
    },
    listItemToggle: {
        borderBottomWidth: 0.5,
        paddingTop: 10,
        paddingBottom: 10,
        borderColor: colors.text,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    listItemStart: {
        borderTopWidth: 0.5,
    },
    formInput: {
        alignSelf: 'flex-start',
        marginTop: 10,
        marginBottom: 0,
        width: '100%',
        backgroundColor: colors.formBackground,
        borderRadius: 5,
        padding: 5,
        minHeight: 40,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        color: colors.text,
        fontSize: 20,
    },
    userValues: {
        color: 'gray',
        fontSize: 15,
        marginLeft: 10,
    },
});