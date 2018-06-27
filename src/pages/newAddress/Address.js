import React from "react";
import { View, Text, TouchableOpacity, Image, TextInput, FlatList, StyleSheet, Platform } from "react-native";
import Base from "../base";
import RadioButton from "react-native-radio-button";
import Style from "./NewAddressStyle";
import { Color } from "../../styles/Color";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Card, CheckBox } from "react-native-elements";
import SplashScreen from "react-native-splash-screen";
import Service from "../../routes/service";
import { Constants } from "../../utils/constants";
import { Dropdown } from 'react-native-material-dropdown';
import SideMenu from "../sideMenu/SideMenu";
import ActionButton from 'react-native-action-button';
import IconAwesome from "react-native-vector-icons/FontAwesome";

export default class Address extends Base {
  static instance;
  constructor() {
    super();
    instance = this;
    this.onFailure = this.onFailure.bind(this);
    this._showProgress = this._showProgress.bind(this);
    this._hideProgress = this._hideProgress.bind(this);
    this.callBackAddress = this.callBackAddress.bind(this);
    this._onSuccessAddress = this._onSuccessAddress.bind(this);
  }

  componentDidMount() {
    this.callBackAddress();
    SideMenu.fetchDetails();

  }

  _showProgress() {
    this.setState({
      progrstatus: true,
    });
  }

  _hideProgress() {
    this.setState({
      progrstatus: false
    });
  }

  callBackAddress() {
    Service.getInstance()._getAddress(this, this._onSuccessAddress, this._onFailure);
  }

  _onSuccessAddress(responseDate) {
    this.setState({
      listData: responseDate
    });
  }

  onFailure() { }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={Style.root}>
        <Image
          style={Style.bg}
          source={require("../../../assets/cover.png")}
          resizeMode="stretch"
        />
        <LinearGradient
          colors={[
            "#036937",
            "#1F7727",
            "#287B1F",
            "#388317",
            "#468B0E",
            "#539108",
            "#5A9502"
          ]}
          start={{ x: 0.0, y: 1.0 }}
          end={{ x: 1.0, y: 1.0 }}
          style={{
            width: "100%",
            height: Platform.OS === 'ios' ? 64 : 60,
            alignItems: "center",
            justifyContent: "center",
            bottom: 0
          }}
        />
        <FlatList style={{ marginBottom: 20 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={true}
          removeClippedSubviews={false}
          extraData={this.state}
          data={this.state.listData}
          renderItem={({ item }) => (
            <Card containerStyle={[styles.categoryCard, { backgroundColor: this.state[item.entity_id] ? "lightgray" : "white" }]}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    [this.state.prev]: false,
                    [item.entity_id]: true,
                    prev: item.entity_id,
                    address: item,
                    selectedArea: undefined,
                    selectedCity: undefined
                  })

                  this.props.navigation.state.params.callBack(item);
                  this.props.navigation.goBack();
                }}
              >
                <View style={{ marginRight: 30 }}>
                  <Text style={styles.addtext}>{item.door_no} {item.street_name}</Text>
                  <Text style={styles.addtext}>{item.city} {item.region} - {item.postcode}</Text>
                </View>
                <IconAwesome
                  size={20}
                  color={Color.darkgree}
                  name="edit"
                  style={{ position: "absolute", right: 0, top: 0 }}
                  onPress={() => navigate("NewAddress", { callBack: this.callBackAddress, flag: true, address: item })}
                />

              </TouchableOpacity>
            </Card>

          )}
          keyExtractor={item => item.entity_id}
        />

        {/* <View style={{ bottom: 0, flex: 1 }}> */}
          <ActionButton buttonColor={Color.darkgree} style={{ flex: 0.2 }}
            onPress={() => navigate("NewAddress", { callBack: this.callBackAddress, flag: false, address: undefined })}
          />
        {/* </View> */}
        {this.state.progrstatus ? <Base /> : null}
      </View >
    );
  }
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});