import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Card, Title, Paragraph, Divider} from 'react-native-paper';
import {AuthContext} from '../navigation/AuthProvider';
import {useTheme} from '../navigation/ThemeProvider';
import NavFooter from '../components/NavFooter';
import firestore from '@react-native-firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';
import Spinner from 'react-native-loading-spinner-overlay';

export default function ResourcesScreen({navigation}) {
  let {colors, isDark} = useTheme();
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [conditions, setConditions] = useState([]);
  const [conditionsOpen, setConditionsOpen] = useState(false);
  const [condition, setCondition] = useState('');
  const [filterTypes, setFilterTypes] = useState([]);
  const [filterTypesOpen, setFilterTypesOpen] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [topics, setTopics] = useState([]);
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  async function getResources() {
    setLoading(true);
    let resourcesObj = [];
    await firestore()
      .collection('RESOURCES')
      .get()
      .then((snapShot) => {
        snapShot.forEach((doc) => {
          try {
            doc.data().title = decodeURI(doc.data().title);
          } catch (err) {
            console.debug(doc.data().title);
          }

          resourcesObj.push(doc.data());
        });
      })
      .then(async (res) => {
        setResources((oldState) => resourcesObj);
        setLoading(false);
      });
  }

  function checkCategory(resource, category) {
    if (resource.categories.includes(category) || category == '') {
      return true;
    }
    return false;
  }
  function checkCondition(resource, condition) {
    if (condition == '' || resource.tags.includes(condition)) {
      return true;
    }
    return false;
  }
  function checkType(resource, filterType) {
    if (resource.filterType == filterType || filterType == '') {
      return true;
    }
    return false;
  }
  function checkTopic(resource, topic) {
    if (resource.tags.includes(topic) || topic == '') {
      return true;
    }
    return false;
  }
  function checkSearch(resource, search) {
    if (search == '') {
      return true;
    }
    for (let searchWord of search.split(' ')) {
      if (searchWord.length > 2) {
        if (resource.title.toLowerCase().includes(searchWord.toLowerCase())) {
          return true;
        }
      }
    }
    return false;
  }

  function filterResources() {
    let counter = 0;
    let retArray = [];
    let allTitles = [];

    for (let resource of resources) {
      if (allTitles.includes(resource.title)) {
        continue;
      } else {
        allTitles.push(resource.title);
      }
      let allClear = [];
      if (resource.tags == undefined || typeof resource.tags == 'string') {
        resource['tags'] = [];
      }
      for (let category of resource['categories']) {
        if (typeof category === 'object') {
          resource['categories'] = category['_binaryString'];
        }
      }
      resource.title = resource.title;
      allClear.push(checkCategory(resource, category));
      allClear.push(checkCondition(resource, condition));
      allClear.push(checkType(resource, filterType));
      allClear.push(checkTopic(resource, topic));
      allClear.push(checkSearch(resource, search));

      resource.tags = resource.tags.join(' ');
      if (!allClear.includes(false)) {
        retArray.push(resource);
        counter += 1;
      }
    }
    return retArray;
  }

  function searchResources() {
    let filteredResources = filterResources();
    navigation.navigate('SearchedResources', {
      data: filteredResources,
      numberOfResourcesFound: filteredResources.length,
      category: category,
      condition: condition,
      filterType: filterType,
      search: search,
    });
  }

  function setFilters() {
    if (filterTypes.length === 0) {
      setFilterTypes([
        {label: 'Type', value: ''},
        {label: 'Articles', value: 'Article'},
        {label: 'Modules', value: 'Module'},
        {label: 'Social', value: 'Social'},
        {label: 'Posts', value: 'Posts'},
        {label: 'Guides', value: 'Guides'},
        {label: 'Videos', value: 'Videos'},
        {label: 'Podcasts', value: 'Podcasts'},
        {label: 'Seminars', value: 'Seminars'},
        {label: 'Products', value: 'Products'},
      ]);
    }
    let topicsList = [];
    setTopics([{label: 'Topic', value: ''}]);
    let conditionsList = [];
    setConditions([{label: 'Condition', value: ''}]);
    let categoriesList = [];
    setCategories([{label: 'Category', value: ''}]);
    let types = [];
    for (const resource of resources) {
      if (resource['type'] == 'Posts') {
        for (const tag of resource['tags']) {
          if (!topicsList.includes(tag)) {
            setTopics((oldArray) => [...oldArray, {label: tag, value: tag}]);
            topicsList.push(tag);
          }
        }
      }
      if (resource['type'] == 'Articles') {
        for (const tag of resource['tags']) {
          if (!conditionsList.includes(tag)) {
            setConditions((oldArray) => [
              ...oldArray,
              {label: tag, value: tag},
            ]);
            conditionsList.push(tag);
          }
        }
      }
      for (const category of resource['categories']) {
        if (typeof category === 'object') {
          if (!categoriesList.includes(category['_binaryString'])) {
            setCategories((oldArray) => [
              ...oldArray,
              {
                label: category['_binaryString'],
                value: category['_binaryString'],
              },
            ]);
            categoriesList.push(category['_binaryString']);
          }
        } else {
          if (!categoriesList.includes(category)) {
            setCategories((oldArray) => [
              ...oldArray,
              {label: category, value: category},
            ]);
            categoriesList.push(category);
          }
        }
      }
    }
  }

  useEffect(() => {
    if (Object.keys(resources).length == 0) {
      getResources();
    }
    if (resources.length > 0) {
      setFilters();
    }
  }, [resources]);

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
                searchablePlaceholder="Choose Category"
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
                searchablePlaceholder="Choose Condition"
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
                searchablePlaceholder="Choose Type"
                searchablePlaceholderTextColor="gray"
                seachableStyle={{}}
                searchableError={() => <Text>Not Found</Text>}
                placeholder={'Select a type'}
              />
            </View>
            <View style={styles(colors).dropDownsFourth}>
              <DropDownPicker
                items={topics}
                open={topicsOpen}
                setOpen={setTopicsOpen}
                value={topic}
                setValue={setTopic}
                setItems={setTopics}
                searchable={true}
                searchablePlaceholder="Choose Topic"
                searchablePlaceholderTextColor="gray"
                seachableStyle={{}}
                searchableError={() => <Text>Not Found</Text>}
                placeholder={'Select a topic'}
              />
            </View>
            <View style={styles(colors).searchTermContainer}>
              <FormInput
                labelName="Search text..."
                value={search}
                autoCapitalize="none"
                onChangeText={(userSearch) => setSearch(userSearch)}
                style={styles(colors).searchTerm}
              />
            </View>
          </Card.Content>
        </Card>
        <View style={styles(colors).stacks}>
          <View style={styles(colors).buttonContainer}>
            <FormButton
              title="Search"
              modeValue="contained"
              onPress={() => searchResources()}
            />
          </View>
        </View>
      </View>
      <NavFooter
        navigation={navigation}
        destA="About"
        destB=""
        destC="MyResources"
        iconA="card-account-details"
        iconB="bookshelf"
        iconC="content-save"
      />
    </View>
  );
}

const styles = (colors) =>
  StyleSheet.create({
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
      zIndex: 4,
    },
    dropDownsSecond: {
      marginBottom: 15,
      zIndex: 3,
    },
    dropDownsThird: {
      marginBottom: 15,
      zIndex: 2,
    },
    dropDownsFourth: {
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
      color: 'white',
    },
    searchTermContainer: {
      marginTop: 20,
    },
    searchTerm: {
      marginTop: 10,
      marginBottom: 10,
      backgroundColor: 'white',
      borderRadius: 5,
      padding: 10,
    },
    stacks: {
      marginBottom: 40,
    },
  });
