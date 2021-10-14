import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Divider } from 'react-native-paper';
import { AuthContext } from '../navigation/AuthProvider';
import {useTheme} from '../navigation/ThemeProvider';
import NavFooter from '../components/NavFooter';
import firestore from '@react-native-firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';
import Spinner from 'react-native-loading-spinner-overlay';


export default function ResourcesScreen({ navigation }) {
    let {colors, isDark} = useTheme();
    const [resources, setResources] = useState({});
    const [categories, setCategories] = useState([]);
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [category, setCategory] = useState('');
    const [conditions, setConditions] = useState([]);
    const [conditionsOpen, setConditionsOpen] = useState(false);
    const [condition, setCondition] = useState('');
    const [filterTypes, setFilterTypes] = useState([]);
    const [filterTypesOpen, setFilterTypesOpen] = useState(false);
    const [filterType, setFilterType] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    async function getResources(){
        setLoading(true);
        let resourcesObj = {};
        await firestore()
        .collection('RESOURCES_CATEGORIES').limit(1000)
        .get().then(async (snapShotCategories) => {
            return await Promise.all(snapShotCategories.docs.map(async (snapShotCategory) => {
                resourcesObj[snapShotCategory.id] = {'Articles': [], 'Modules': []};
                await firestore()
                .collection('RESOURCES_CATEGORIES')
                .doc(snapShotCategory.id)
                .collection('Articles').limit(1000).get()
                .then((snapShotArticles) => {
                    snapShotArticles.docs.map((article) => {
                        resourcesObj[snapShotCategory.id]['Articles'].push(article.data());
                    });
                }).then( async (res) => {
                    setResources(oldState => ({...oldState, [snapShotCategory.id] : {
                        'Articles' : resourcesObj[snapShotCategory.id]['Articles'],
                        // 'Modules' : oldState[snapShotCategory.id]['Modules']
                    }}));
                }).then( async (res) =>{
                    await firestore()
                    .collection('RESOURCES_CATEGORIES')
                    .doc(snapShotCategory.id)
                    .collection('Modules').limit(1000).get()
                    .then((snapShotModules) => {
                        snapShotModules.docs.map((module) => {
                            resourcesObj[snapShotCategory.id]['Modules'].push(module.data());
                        });
                    }).then( res => {
                        setResources(oldState => ({...oldState, [snapShotCategory.id] : {
                            'Articles' : oldState[snapShotCategory.id]['Articles'],
                            'Modules' : resourcesObj[snapShotCategory.id]['Modules']
                        }}));
                    });
                } );
            }));
        }).then( res => {
            setLoading(false);
        });
    }

    function checkCategory(resource, category){
        if(resource.category == category || category == ''){
            return true;
        }
        return false;
    }
    function checkCondition(resource, condition){
        if(condition == '' || resource.data.tags.includes(condition)){
            return true;
        }
        return false;
    }
    function checkType(resource, filterType){
        if(resource.filterType == filterType || filterType == ''){
            return true;
        }
        return false;
    }
    function checkSearch(resource, search){
        if(search == ''){
            return true;
        }
        for(let searchWord of search.split(" ")) {
            if(searchWord.length > 2){
                if(resource.data.title.toLowerCase().includes(searchWord.toLowerCase())){
                    return true;
                }
            }
        }
        return false;
    }

    function filterResources(search, category, condition, filterType, reformattedReources){

        let counter = 0;
        let retArray = [];
        let allTitles = [];

        for(let resource of reformattedReources){
            if(allTitles.includes(resource.data.title)){
                continue;
            } else {
                allTitles.push(resource.data.title);
            }
            let allClear = [];
            if(resource.data.tags == undefined || typeof resource.data.tags == 'string'){
                resource.data['tags'] = [];
            }
           
            allClear.push(checkCategory(resource, category));
            allClear.push(checkCondition(resource, condition));
            allClear.push(checkType(resource, filterType));
            allClear.push(checkSearch(resource, search));
           
            resource.data.tags = resource.data.tags.join(' ');
            if(!allClear.includes(false)){
                retArray.push(resource);
                counter += 1;
            }
        }
        return retArray;
    }

    function reformatList(){
        let newList = [];
        for(let resource in resources){
            for(let article of resources[resource]['Articles']){
                newList.push({
                    category: resource,
                    filterType: 'Article',
                    data: article
                });
            }
            for(let module of resources[resource]['Modules']){
                newList.push({
                    category: resource,
                    filterType: 'Module',
                    data: module
                });
            }
        }
        return newList;
    }

    function searchResources(){
        let reformattedReources = reformatList();
        let filteredResources = filterResources(search, category, condition, filterType, reformattedReources);        
        navigation.navigate('SearchedResources', {
            data: filteredResources,
            numberOfResourcesFound: filteredResources.length,
            category: category,
            condition: condition,
            filterType: filterType,
            search: search,
        });
    }

    function setFilters(){
        if(filterTypes.length === 0) {
            setFilterTypes([{label: 'Type', value: ''},{label: 'Articles', value: 'Article'},{label: 'Modules', value: 'Module'}])
        }
        let categoriesList = [];
        setCategories([{label: 'Category', value: ''}]);
        for( const resource in resources){
            if(!categoriesList.includes(resource)){
                setCategories(oldArray => [...oldArray, {label: resource, value: resource}]);
                categoriesList.push(resource);
            }
        }
        let conditionsList = [];
        setConditions([{label: 'Condition', value: ''}]);
        for(const resource in resources){
            for(const article of resources[resource]['Articles']){
                for(const tag of article.tags){
                    let screenedTag = tag.replace('&amp;', '&');
                    if(!conditionsList.includes(screenedTag)){
                        setConditions(oldArray => [...oldArray, {label: screenedTag, value: screenedTag}]);  
                        conditionsList.push(screenedTag);
                    }
                }
            }
        }
    }

    useEffect(() => {
        if(Object.keys(resources).length == 0){
            getResources();
        }
        setFilters();
    }, []);

    return (
    <View style={styles(colors).container}>
        <Spinner
          visible={loading}
          textContent={'Loading...'}
          textStyle={styles(colors).spinnerTextStyle}
          color={'white'}
        />
        <View style={styles(colors).content}>
        <Card style={styles(colors).card}>
              <Card.Title
                title={'Filter Resources'}
                titleStyle={styles(colors).cardTitle}
              />
              <Divider style={styles(colors).divider}></Divider>
              <Card.Content>
                <View style={styles(colors).dropDownsFirst}>
                    <DropDownPicker
                    items={categories}
                    open={categoriesOpen}
                    setOpen={setCategoriesOpen}
                    value={category}
                    setValue={setCategory}
                    setItems={setCategories}
                    searchable={true}
                    searchablePlaceholder="Choose Condition Category"
                    searchablePlaceholderTextColor="gray"
                    seachableStyle={{}}
                    searchableError={() => <Text>Not Found</Text>}
                    placeholder={'Select a category'}
                    />
                </View>
                <View style={styles(colors).dropDownsSecond}>
                    <DropDownPicker
                    items={conditions}
                    open={conditionsOpen}
                    setOpen={setConditionsOpen}
                    value={condition}
                    setValue={setCondition}
                    setItems={setConditions}
                    searchable={true}
                    searchablePlaceholder="Choose Condition Category"
                    searchablePlaceholderTextColor="gray"
                    seachableStyle={{}}
                    searchableError={() => <Text>Not Found</Text>}
                    placeholder={'Select a condition'}
                    />
                </View>
                <View style={styles(colors).dropDownsThird}>
                    <DropDownPicker
                    items={filterTypes}
                    open={filterTypesOpen}
                    setOpen={setFilterTypesOpen}
                    value={filterType}
                    setValue={setFilterType}
                    setItems={setFilterTypes}
                    searchable={true}
                    searchablePlaceholder="Choose Condition Category"
                    searchablePlaceholderTextColor="gray"
                    seachableStyle={{}}
                    searchableError={() => <Text>Not Found</Text>}
                    placeholder={'Select a type'}
                    />
                </View>
                <View style={styles(colors).searchTermContainer}>
                    <FormInput
                        labelName='Search text...'
                        value={search}
                        autoCapitalize='none'
                        onChangeText={userSearch => setSearch(userSearch)}
                        style={styles(colors).searchTerm}
                    />
                </View>
              </Card.Content>
            </Card>
            <View style={styles(colors).stacks}>
                <View style={styles(colors).buttonContainer}>
                    <FormButton
                    title='Search'
                    modeValue='contained'
                    onPress={() => searchResources()}
                    />
                </View>
            </View>
        </View>
        <NavFooter
          navigation={navigation}
          destA='About'
          destB=''
          destC='MyResources'
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
        padding: 20,
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
        zIndex: 0,
    },
    submitButtonLabel: {
        fontSize: 22,
        color: '#fff',
    },
    dropDownsFirst: {
        marginBottom: 15,
        zIndex: 3,
    },
    dropDownsSecond: {
        marginBottom: 15,
        zIndex: 2,
    },
    dropDownsThird: {
        zIndex: 1,
    },
    buttonContainer: {
        marginTop: 20,
    },
    card: {
        width: '100%',
        backgroundColor: colors.backgroundShaded,
        zIndex: 4,
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
        marginLeft: 15,
        marginRight: 15,    
        marginBottom: 15,
    },
    spinnerTextStyle: {
        color: 'white'
    },
    searchTermContainer: {
        marginTop: 20,
    },
    searchTerm: {
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: colors.formBackground,
        borderRadius: 5,
        padding: 10,
    },
    stacks: {
        marginBottom: 40,
    }
});