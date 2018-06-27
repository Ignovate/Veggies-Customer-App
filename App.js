import React, { Component } from 'react';
import Root from './src/routes/routes';
import SInfo from "react-native-sensitive-info";
import codePush from "react-native-code-push";

import {
  Text
} from "react-native";
import {
  setCustomTextInput,
  setCustomText
} from "react-native-global-props";

const customTextInputProps = {
  style: {
    fontFamily: "Montserrat-Regular"
  }
};

const customTextProps = {
  style: {
    fontFamily: "Montserrat-Regular"
  }
};

setCustomTextInput(customTextInputProps);
setCustomText(customTextProps);

Text.defaultProps.allowFontScaling = false

class App extends Component {


  constructor(props) {
    super(props);
    console.disableYellowBox = true;
    this.state = {
      signedIn: false,
      checkedSignIn: false
    };
  }

  componentWillMount() {
    SInfo.getItem("customer_id", {}).then(value => {
      if (value != "" && value != "null" && value != null) {
        this.setState({ signedIn: true, checkedSignIn: true })
      } else {
        this.setState({ signedIn: false, checkedSignIn: true })
      }
    });
  }

  render() {
    const { checkedSignIn, signedIn } = this.state;

    // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
    if (!checkedSignIn) {
      return null;
    }

    const Layout = Root(signedIn);
    return <Layout />;
  }
}

let codePushOptions = { 
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME, 
  installMode: codePush.InstallMode.IMMEDIATE 
}
App = codePush(codePushOptions)(App);
module.exports = App

export default App;

