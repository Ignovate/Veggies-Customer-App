import React from "react";
import { View, Text, Image } from "react-native";
import Base from "../base";
import Style from "./OrderPlacedStyle";
import LinearGradient from "react-native-linear-gradient";
import SideMenu from "../sideMenu/SideMenu";

export default class OrderPlaced extends Base {

  componentDidMount() {
    SideMenu.fetchDetails();
    // Start counting when the page is loaded
    this.timeoutHandle = setTimeout(() => {
        this._moveToHomePage();
    }, 5000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutHandle); // This is just necessary in the case that the screen is closed before the timeout fires, otherwise it would cause a memory leak that would trigger the transition regardless, breaking the user experience.
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={Style.root}>
        <Image
          style={Style.bg}
          source={require("../../../assets/cover.png")}
          resizeMode="stretch"
        />
        <Text style={Style.successText}>Order Placed Successfully</Text>
        <Text style={Style.emailText}>Your order is being processed</Text>
      </View>
    );
  }
}
