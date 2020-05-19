import React, {useContext, useState} from 'react';
import Realm from 'realm';
import {getApp} from './getApp';

// Create a new Context object that will be provided to descendents of the AuthProvider.
const AuthContext = React.createContext(null);

// Access the Realm App.
const app = getApp();

// The AuthProvider is responsible for user management and provides the
// AuthContext value to its descendents. Components under an AuthProvider can
// use the useAuth() hook to access the auth value.
const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);

  // The log in function takes an email and password and uses the emailPassword
  // authentication provider to log in.
  const logIn = async (email, password) => {
    console.log(`Logging in as ${email} with password ${password}...`);
    try {
      const creds = Realm.Credentials.emailPassword(email, password);
      const newUser = await app.logIn(creds);
      setUser(newUser);
      console.log(`Logged in as ${newUser.identity}`);
    } catch (error) {
      console.error(`Login failed: ${error}`);
    }
  };

  // Log out the current user.
  const logOut = () => {
    if (user == null) {
      console.error("Not logged in -- can't log out!");
      return;
    }
    console.log('Logging out...');
    user.logOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        logIn,
        logOut,
        user,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

// The useAuth hook can be used by components under an AuthProvider to access
// the auth context value.
const useAuth = () => {
  const auth = useContext(AuthContext);
  if (auth == null) {
    throw new Error('useAuth() called outside of a AuthProvider?');
  }
  return auth;
};

export {AuthProvider, useAuth};
