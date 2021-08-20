import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import {useTheme} from '../navigation/ThemeProvider';
import Spinner from 'react-native-loading-spinner-overlay';


export default function ResourcesScreen({ route, navigation }) {
    let {colors, isDark} = useTheme();
    const [numberOfResourcesFound, setNumberOfResourcesFound] = useState('');
    const [loading, setLoading] = useState(false);
    const [filteredResources, setFilteredResources] = useState([]);

    function filterResources(){
        console.log(route.params.data.length);
        if(route.params.category == ''){
            console.log('Empty Category');
        }
        if(route.params.condition == ''){
            console.log('Empty Condition');
        }
        if(route.params.filterType == ''){
            console.log('Empty FilterType');
        }

    }
    function showResources(){
        console.log(route.params.category,route.params.condition,route.params.filterType);
    }
    
    useEffect(() => {
        setLoading(true);
        filterResources();
        showResources();
        setLoading(false);
    },[]);
    return (
    <View style={styles(colors).container}>
        <View tyle={styles(colors).container}>
            <Spinner
            visible={loading}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
            />
            <Text style={styles(colors).warningTitle}>My Resources Screen</Text>
        </View>
    </View>
    );
}

const styles = (colors) => StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
        justifyContent: 'space-between',
    },
    warningContainer: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'red',
        backgroundColor: 'pink',
        padding: 20,
    },
    warningTitle: {
        fontSize: 20,
        textAlign: 'center',
    },
    submit: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    submitButtonLabel: {
        fontSize: 22,
        color: '#fff',
    },
});