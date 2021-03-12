import React, {
    useState,
    useEffect,
    useCallback,
    useRef,
    Fragment,
    useContext,
  } from 'react';
  import { AppState } from 'react-native';
  import moment from 'moment';
  import { AuthContext } from '../navigation/AuthProvider';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  
  const SessionTimeout = () => {
    const [appState, setAppState] = useState(AppState.currentState);
    const { user, logout } = useContext(AuthContext);
  
    let timeStamp;
    let warningInactiveInterval = useRef();
    let startTimerInterval = useRef();
  
    // start inactive check
    let timeChecker = async () => {
        setAppState(AppState.currentState);
        let storedTimeStamp = await AsyncStorage.getItem('lastTimeStamp');
        const diff = moment().valueOf() - storedTimeStamp;
  
        // 60000 is one minute of milliseconds 300000 = 5 minutes
        if (diff > 300000) {
            clearInterval(warningInactiveInterval.current);
            AsyncStorage.removeItem('lastTimeStamp');
            logout();
        }
    };
  
    // reset interval timer
    let resetTimer = useCallback(() => {
        clearTimeout(startTimerInterval.current);
        clearInterval(warningInactiveInterval.current);
        if (user) {
            timeStamp = moment().valueOf();
            AsyncStorage.setItem('lastTimeStamp', timeStamp.toString());
        } else {
            clearInterval(warningInactiveInterval.current);
            AsyncStorage.removeItem('lastTimeStamp');
        }
        timeChecker();
    }, [user]);
  
    useEffect(() => {
        if(appState.current == 'active') {
            resetTimer();
        }
        AppState.addEventListener('change', timeChecker);    
        return () => {
            clearTimeout(startTimerInterval.current);
            resetTimer();
            AppState.removeEventListener("change", timeChecker);
        };
    }, [resetTimer, appState, timeChecker]);
  
    // change fragment to modal and handleclose func to close
    return <Fragment />;
  };
  
  export default SessionTimeout;