/**
 * Created by Dima Portenko on 30.06.2021
 */
import React from 'react';
import {
  View,
  SafeAreaView,
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  Text,
} from 'react-native';
import {DemoButton} from '../components/DemoButton';
import * as ImagePicker from 'react-native-image-picker';
import {ImagePickerResponse} from 'react-native-image-picker/src/types';
import {useEffect} from 'react';
import {theme} from '../theme';
import {Icon} from '@rneui/base';

export const SelectImageScreen = ({navigation}: any) => {
  const {width} = useWindowDimensions();
  const [response, setResponse] = React.useState<ImagePickerResponse | null>(
    null,
  );
  // @ts-ignore
  const onButtonPress = React.useCallback((type, options) => {
    if (type === 'capture') {
      ImagePicker.launchCamera(options, setResponse);
    } else {
      ImagePicker.launchImageLibrary(options, setResponse);
    }
  }, []);

  const onProcessImage = () => {
    if (response) {
      navigation.navigate('ProcessImage', {
        uri: response?.assets?.[0]?.uri!!,
      });
    }
  };

  useEffect(() => {
    setResponse(null);
  }, [setResponse]);

  return (
    <ScrollView style={styles.outerContainer}>
      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.header}>
          <Icon
            style={styles.backIcon}
            name="chevron-left"
            type="material"
            color={'white'}
            size={30}
            onPress={() => navigation.goBack()}
          />
        </View>
        <ScrollView style={styles.content}>
          <Text style={styles.welcomeText}>Receipt Image Select</Text>
          <Text style={{marginBottom: 20}}>
            Upload a receipt or take a picture of a new one
          </Text>
          {!response && <View style={{flexDirection: 'row', paddingVertical: 8}}>
            <DemoButton
              key="Take Image"
              onPress={() =>
                onButtonPress('capture', {
                  saveToPhotos: true,
                  mediaType: 'photo',
                  includeBase64: false,
                })
              }>
              {'Take Image'}
            </DemoButton>
            <DemoButton
              key="Select Image"
              onPress={() =>
                onButtonPress('library', {
                  selectionLimit: 0,
                  mediaType: 'photo',
                  includeBase64: false,
                })
              }>
              {'Select Image'}
            </DemoButton>
          </View>}
          <View style={{paddingHorizontal: 8}}></View>
          {response?.assets &&
            response?.assets.map(({uri}) => (
              <View key={uri} style={styles.image}>
                <Image
                  resizeMode="contain"
                  resizeMethod="scale"
                  style={{width, height: width}}
                  source={{uri: uri}}
                />
              </View>
            ))}
          {response && (
            <View style={{flexDirection: 'row', paddingBottom: 8}}>
              <DemoButton key="Process Image" onPress={onProcessImage}>
                {'Process Image'}
              </DemoButton>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ScrollView>
  );
};

// const styles = StyleSheet.create({
//   image: {
//     marginVertical: 24,
//     alignItems: 'center',
//   },
// });

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: theme.colors.themeLight,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: theme.spacing.s,
    paddingHorizontal: theme.spacing.xl,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  welcomeText: {
    color: 'black',
    fontSize: 32,
    fontWeight: 600,
    marginBottom: 4,
  },
  hero: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  heroImage: {
    resizeMode: 'contain',
    height: 200,
  },
  forgotPasswordText: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  content: {
    paddingTop: 40,
    marginTop: 20,
    paddingBottom: 40,
    paddingLeft: theme.spacing.xl,
    paddingRight: theme.spacing.xl,
    backgroundColor: '#ffffff',
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden',
    height: 1000,
  },
  textInput: {
    backgroundColor: theme.colors.textLight,
    borderRadius: theme.spacing.m,
    paddingLeft: theme.spacing.m,
  },
  formInputLabel: {
    paddingLeft: theme.spacing.m,
    marginBottom: theme.spacing.s,
  },
  formInputGroup: {
    marginBottom: theme.spacing.l,
  },
  forgotPasswordContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  signInButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.themeVDark,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 40,
    paddingVertical: 10,
  },
  itemButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.themeDark,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 10,
  },
  signInText: {
    fontSize: theme.fontSize.m,
    color: theme.colors.textLight,
    fontWeight: 800,
  },
  backIcon: {
    marginTop: 5,
  },
});
