import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import {AuthContext} from '../navigation/AuthProvider';
import {useTheme} from '../navigation/ThemeProvider';
import Spinner from 'react-native-loading-spinner-overlay';
import {Card, Title, Paragraph, Divider, Button} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {IconButton} from 'react-native-paper';
import Clipboard from '@react-native-community/clipboard';
import auth from '@react-native-firebase/auth';
import FormButton from '../components/FormButton';

export default function ResourcesScreen({route, navigation}) {
  let {colors, isDark} = useTheme();
  const user = auth().currentUser;
  const [loading, setLoading] = useState(false);
  const [resourceLimit, setResourceLimit] = useState(5);

  async function saveResource(title, url) {
    alert('Resource saved to your resources');
    await firestore()
      .collection('USERS')
      .doc(user.uid)
      .collection('RESOURCES')
      .add({
        date: new Date().getTime(),
        from: 'Saved',
        link: url,
        title: title,
      });
  }

  function copyToClipboard(url) {
    alert('Link copied to clipboard');
    Clipboard.setString(url);
  }

  function loadMore() {
    let currentLimit = resourceLimit;
    setResourceLimit(currentLimit + 5);
  }

  useEffect(() => {}, []);

  return (
    <View style={styles(colors).container}>
      <ScrollView
        style={styles(colors).scrollContainer}
        scrollIndicatorInsets={{right: 1}}>
        <Spinner
          visible={loading}
          textContent={'Loading...'}
          textStyle={styles(colors).spinnerTextStyle}
          color={'white'}
        />
        <View style={styles(colors).content}>
          <View style={styles(colors).filtersContainer}>
            <Text style={styles(colors).filterChoices}>
              Your filters: {route.params.category} {route.params.condition}{' '}
              {route.params.filterType}
            </Text>
          </View>
          <Text style={styles(colors).numberOfResourcesText}>
            {route.params.numberOfResourcesFound} Resources Found
          </Text>
          {/* <Divider style={styles(colors).divider}></Divider> */}
          {route.params.data.slice(0, resourceLimit).map((resource) => {
            return (
              <Card style={styles(colors).card} key={resource.title}>
                {/* <Card.Title
                                title={resource.title}
                                subtitle="Card Subtitle"
                                titleStyle={styles(colors).cardSubTitle}
                            /> */}
                <Title style={styles(colors).cardSubTitle}>
                  {resource.title}
                </Title>
                {/* <Divider style={styles(colors).divider}></Divider> */}
                <Card.Content style={styles(colors).cardDetails}>
                  <Paragraph style={styles(colors).cardText}>
                    Category: {resource.categories}
                  </Paragraph>
                  <Paragraph style={styles(colors).cardText}>
                    Topic/Condition: {resource.tags}
                  </Paragraph>
                  <Paragraph style={styles(colors).cardText}>
                    Type: {resource.type}
                  </Paragraph>
                </Card.Content>
                <Card.Actions style={styles(colors).cardButtons}>
                  {/* <IconButton
                                    icon='link'
                                    size={30}
                                    color='#5DA8E7' 
                                    onPress={() => copyToClipboard(resource.url)}
                                /> */}
                  <Button
                    color="#1f65a6"
                    style={styles(colors).cardButton}
                    onPress={() => copyToClipboard(resource.url)}>
                    Copy Link
                  </Button>
                  {/* <IconButton
                                    icon='heart'
                                    size={30}
                                    color='#5DA8E7'
                                    onPress={() => saveResource(resource.title, resource.url)}
                                />   */}
                  <Button
                    color="#1f65a6"
                    style={styles(colors).cardButton}
                    onPress={() => saveResource(resource.title, resource.url)}>
                    Save
                  </Button>
                  {/* <IconButton
                                    icon='arrow-right'
                                    size={30}
                                    color='#5DA8E7'
                                    onPress={() => Linking.openURL(resource.url)}
                                />  */}
                  <Button
                    color="#1f65a6"
                    style={styles(colors).cardButton}
                    onPress={() => Linking.openURL(resource.url)}>
                    View
                  </Button>
                </Card.Actions>
              </Card>
            );
          })}
          <View style={styles(colors).buttonContainer}>
            <FormButton
              title="Load More Resources"
              modeValue="contained"
              onPress={() => loadMore()}
            />
          </View>
        </View>
      </ScrollView>
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
      padding: 15,
    },
    cardText: {
      color: colors.text,
    },
    cardDetails: {
      backgroundColor: colors.backgroundDarker,
      marginLeft: 10,
      marginRight: 10,
      borderRadius: 10,
      padding: 10,
    },
    divider: {
      borderWidth: 1,
      borderColor: colors.text,
      // marginLeft: 15,
      // marginRight: 15,
      marginBottom: 10,
    },
    numberOfResourcesText: {
      color: colors.text,
      fontSize: 30,
      marginBottom: 20,
    },
    cardButtons: {
      justifyContent: 'space-between',
    },
    cardButton: {},
    filterChoices: {
      color: colors.text,
      fontStyle: 'italic',
    },
    filtersContainer: {
      marginBottom: 15,
    },
    spinnerTextStyle: {
      color: 'white',
    },
    buttonContainer: {
      marginTop: 20,
    },
  });
