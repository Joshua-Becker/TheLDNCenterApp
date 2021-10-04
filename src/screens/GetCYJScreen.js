import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import {useTheme} from '../navigation/ThemeProvider';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import firestore from '@react-native-firebase/firestore';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';

export default function GetCYJScreen({ navigation }) {
    const { user, ethree, auditLog } = useContext(AuthContext);
    const currentUser = user.toJSON();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [token, setToken] = useState('');
    const [userNiceName, setUserNiceName] = useState('');
    const [loading, setLoading] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [error, setError] = useState('');
    let {colors, isDark} = useTheme();

    async function loginUser() {
        console.log("Logging in...");
        const siteUrl = 'https://theldnhealthcenter.com'; //'https://tlhc-staging.cloudaccess.host';
        const loginData = {
          username: email,
          password: password
        };
        setLoading(true);
        console.log("Just before...", loginData);
        axios.post(`${siteUrl}/wp-json/jwt-auth/v1/token`, loginData)
          .then(res => {
            console.log('Success');
            if (undefined === res.data.token) {
              setError(res.data.message);
              setLoading(false);
              return;
            }
            setLoading(false);
            setToken(res.data.token);
            // setUserNiceName(res.data.user.nicename);
            setUserEmail(res.data.user_email);
            setLoggedIn(true);
          })
          .catch(err => {
            console.log('Fail');
            console.log(err);
            if (err.response.data.message.indexOf('Unknown email address') > -1) {
              alert("Unknown email address. Please try again!");
              return;
            }
            if (err.response.data.message.indexOf('Unknown username') > -1) {
              alert("Unknown username. Please try again!");
              return;
            }
            if (err.response.data.code.indexOf('incorrect_password') > -1) {
              alert("Incorrect password. Please try again!");
              return;
            }
            console.log(err.response.data);
            setLoading(false);
            setError(err.response.data);
          })
    }

    async function getData(){
        setLoading(true);
        console.log(token);
        const PROFILE = 'https://theldnhealthcenter.com/wp-json/cyj/v1/all'; // 'https://tlhc-staging.cloudaccess.host/wp-json/cyj/v1/all';
        fetch(PROFILE, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(async data => {
            let fields = JSON.parse(data['fields'])
            let objLst = [];
            const identifiers = ['Address', 'Email', 'Name', 'Sex', 'Age', 'User ID', 'User Name']
            for(field in fields){
                if(!identifiers.includes(fields[field]['name'])) {
                    fields[field]['value'] = fields[field]['value'].replace(/(\r\n|\n|\r)/gm, ", ");
                    objLst.push({'name' : fields[field]['name'], 'value': fields[field]['value']});
                } else {
                    let group;
                    group = await ethree.getGroup(currentUser.uid);
                    const findUserIdentity = await ethree.findUsers(currentUser.uid);
                    if(group == null){
                    group = await ethree.loadGroup(currentUser.uid, findUserIdentity);
                    }
                    fields[field]['value'] = await group.encrypt(fields[field]['value'].replace(/(\r\n|\n|\r)/gm, ", "));
                    objLst.push({'name' : fields[field]['name'], 'value': fields[field]['value']});
                }
            }
            storeValues(objLst);
        })
    }

    async function storeValues(objLst){
        await firestore()
        .collection('USERS')
        .doc(currentUser.uid)
        .set({
            'cyj': objLst
        }, { merge: true });
        setLoading(false);
        navigation.navigate('About');
    }
    
    useEffect(() => {
        if(token != ''){
            getData();
            setToken('');
        }
    }), [token];
    
    return (
    <View style={styles(colors).container}>
        <Spinner
          visible={loading}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        <View style={styles(colors).disclaimerBox}>
            <Text style={styles(colors).disclaimerText}>
                Your details from The LDN Health Center website can be fetched here! Simply input your website login details below to gether them. Then all your resources can be matched to your preferences. And if you ever change your details on the website, make sure to come back here to update these as well!
            </Text>
        </View>
        <View style={styles(colors).disclaimerBox}>
            <Text style={styles(colors).disclaimerText}>
                And if you ever change your details on the website, make sure to come back here to update these as well!
            </Text>
        </View>
        <View>
          <FormInput
            labelName='Email'
            value={email}
            autoCapitalize='none'
            onChangeText={userEmail => setEmail(userEmail)}
          />
          <FormInput
            labelName='Password'
            value={password}
            secureTextEntry={true}
            onChangeText={userPassword => setPassword(userPassword)}
          />
        </View>
        <View style={styles(colors).buttonContainer}>
            <FormButton
            title='Get Data'
            modeValue='contained'
            labelStyle={styles(colors).loginButtonLabel}
            onPress={async () => {
                setLoading(true);
                setEmail('');
                setPassword('');
                await loginUser(email, password);
                }
            }
            />
        </View>
    </View>
    );
}

const styles = (colors) => StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    buttonContainer: {
        
    },
    loginButtonLabel: {
        fontSize: 22,
        color: '#fff',
    },
    spinnerTextStyle: {
        color: '#fff'
    },
    disclaimerBox: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'red',
        backgroundColor: 'pink',
        padding: 20,
        marginBottom: 20,
    },
    disclaimerText: {
        fontSize: 15,
        textAlign: 'left',
    },
});