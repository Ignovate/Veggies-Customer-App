/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import PropTypes from "prop-types";
import React, { Component } from "react";
import styles from "./SideMenuStyle";
import { NavigationActions } from "react-navigation";
import { ScrollView, Text, View, Image, TouchableOpacity } from "react-native";
import IconAwesome from "react-native-vector-icons/FontAwesome";
import SInfo from "react-native-sensitive-info";
import Base from "../base";
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import Service from "../../routes/service";

class SideMenu extends Base {
  instance;

  constructor() {
    super();
    instance = this;
  }

  static fetchDetails() {
    SInfo.getItem("name", {}).then(value => {
      instance.setState({
        name: value
      });
    });
    SInfo.getItem("photo", {}).then(value => {
      instance.setState({
        photo: value
      });
    });
  }

  navigateToScreen = route => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.root}>
        <Image
          style={styles.bg}
          source={require("../../../assets/profile_bg.png")}
        />
        <ScrollView style={{ marginBottom: 10 }}>
          <View style={styles.imageContainer}>

            {instance.state.photo == null ?
              <Image
                style={styles.imageCircle}
                source={require("../../../assets/avator.png")}
                resizeMode="cover"
              />
              : <Image
                style={styles.imageCircle}
                resizeMode="cover"
                source={{ uri: instance.state.photo }}
              />
            }

            <Text style={styles.userName}>{instance.state.name == null ? "USER NAME" : instance.state.name}</Text>
            {/* <Image
              style={styles.editIcon}
              source={require("../../../assets/icon-edit.png")}
            /> */}
          </View>

          <View style={styles.itemsParent}>
            <TouchableOpacity
              style={{ flexDirection: "row", marginLeft: 10 }}
              onPress={() => navigate("Home")}
            >
              <Image
                style={styles.menuIcon}
                source={require("../../../assets/icon-home.png")}
              />
              <Text style={styles.menuNames}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flexDirection: "row", marginLeft: 10, marginTop: 30 }}
              onPress={() => navigate("TodaysSpecial", { id: -1, title: "Todays Special" })}
            >
              <Image
                style={styles.menuIcon}
                source={require("../../../assets/icon-special.png")}
              />
              <Text style={styles.menuNames}>Today's Specials</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flexDirection: "row", marginLeft: 10, marginTop: 30 }}
              onPress={() => navigate("TodaysSpecial", { id: 6, title: "Fresh Fruits" })}
            >
              <Image
                style={styles.menuIcon}
                source={require("../../../assets/icon-fruit.png")}
              />
              <Text style={styles.menuNames}>Fresh Fruits</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flexDirection: "row", marginLeft: 10, marginTop: 30 }}
              onPress={() => navigate("TodaysSpecial", { id: 3, title: "Fresh Vegetables" })}
            >
              <Image
                style={styles.menuIcon}
                source={require("../../../assets/icon-veg.png")}
              />
              <Text style={styles.menuNames}>Fresh Vegetables</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flexDirection: "row", marginLeft: 10, marginTop: 30 }}
              onPress={() => navigate("Basket")}
            >
              <Image
                style={styles.menuIcon}
                source={require("../../../assets/icon-basket.png")}
              />
              <Text style={styles.menuNames}>Fresh Basket</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flexDirection: "row", marginLeft: 10, marginTop: 30 }}
              onPress={() => navigate("Order")}
            >
              <Image
                style={styles.menuIcon}
                source={require("../../../assets/icon-orders.png")}
              />
              <Text style={styles.menuNames}>Fresh Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: "row", marginLeft: 10, marginTop: 30 }}
              onPress={() => navigate("TodaysSpecial", { title: "Fresh List" })}
            >
              <Image
                style={styles.menuIcon}
                source={require("../../../assets/icon-fav.png")}
              />
              <Text style={styles.menuNames}>Fresh List</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={{ flexDirection: "row", marginLeft: 10, marginTop: 30 }}
              onPress={() => { this.props.navigation.navigate("Notification"); }}
            >
              <Image
                style={styles.menuIcon}
                source={require("../../../assets/icon-notification.png")}
              />
              <Text style={styles.menuNames}>Notification</Text>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      </View>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object
};

export default SideMenu;
