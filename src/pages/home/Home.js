import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  NetInfo, Platform
} from "react-native";
import Base from "../base";
import Style from "../todaySpecial/TodaysSpecialStyle";
import DrawerButton from "../../utils/DrawerButton";
import styles from "../home/HomeStyle";
import Service from "../../routes/service";
import LinearGradient from "react-native-linear-gradient";
import SplashScreen from "react-native-splash-screen";
import SideMenu from "../sideMenu/SideMenu";
import IconAwesome from "react-native-vector-icons/FontAwesome";
import { Color } from "../../styles/Color";
import SInfo from "react-native-sensitive-info";
import { registerKilledListener, registerAppListener } from "../../utils/Listeners";
import FCM, { NotificationActionType } from "react-native-fcm";
import { Constants } from "../../utils/constants";

const { width, height } = Dimensions.get('window');

export default class Home extends Base {

  constructor(props) {
    super(props);
    this._showProgress = this._showProgress.bind(this);
    this._hideProgress = this._hideProgress.bind(this);
    this._getCartSuccess = this._getCartSuccess.bind(this);
    this.callBack = this.callBack.bind(this);
    this._getLimitSuccess = this._getLimitSuccess.bind(this);
    this._onFailure = this._onFailure.bind(this);
    this._onSuccessConfig = this._onSuccessConfig.bind(this);
    this.state = {
      data: { slide1: [], slide2: [], slide3: [] }
    };

    this.props.navigation.setParams({
      callBack: this.callBack
    });
  }

  componentWillMount() {
    this.image = ( <Image
      style={styles.bg}
      source={require("../../../assets/cover.png")}
      resizeMode="stretch"
    />);
    Service.getInstance()._getConfig(this, this._onSuccessConfig, this._onFailure);
    Service.getInstance()._getCategoryLimit(this, this._getLimitSuccess, this._onFailure);
    FCM.getInitialNotification().then(notif => {
      if (notif.id != undefined) {
        this.props.navigation.navigate("Notification");
      }
    });
  }

  _getLimitSuccess(responseData) {
    SplashScreen.hide();
    this.setState({
      data: responseData
    });
  }

  _onSuccessConfig(responseDate) {
    if (responseDate != undefined) {
      if (responseDate.quote_id != null && responseDate.quote_id != "" && responseDate.quote_id != undefined) {
        SInfo.setItem("quote_id", responseDate.quote_id, {});
      } else {
        SInfo.setItem("quote_id", "", {});
      }
    }
  }

  callBack() {

    SInfo.getItem("quote_id", {}).then(value => {
      if (value != null) {
        Service.getInstance()._getCart(value, this, this._getCartSuccess, this._onFailure);
      }
    });

  }

  componentDidMount() {
    super._permissions();
    registerAppListener(this.props.navigation);
    registerKilledListener(this.props.navigation);

    SideMenu.fetchDetails();

    this.callBack();

    // NetInfo.getConnectionInfo().then((connectionInfo) => {
    //   if (connectionInfo.type == "none" || connectionInfo.type == "unknown") {
    //     this._showAlert("No internet access. Please connect to internet", "OK")
    //   }
    // });
  }

  _onFailure() { }

  _getCartSuccess(responseData) {
    count = 0;
    if (responseData.messages != undefined) {
      if (responseData.items != undefined) {
        for (var i = 0; i < responseData.items.length; i++) {
          count = count + 1;
        }
      } else {
        count = 0;
      }

      this.setState({
        count: count
      });

      this.props.navigation.setParams({ count: count });
    }
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


  renderPrice = (item) => {
    var num = Number(item.price) // The Number() only visualizes the type and is not needed
    var splPrice = Number(item.special_price);
    var roundedString = num.toFixed(2);

    return (
      splPrice == 0 ?
        <Text style={[Style.pricespl]}>Rs. {roundedString}</Text > : <Text style={Style.price}>Rs. {roundedString}</Text>
    );
  }

  renderPriceSpl = (item) => {
    var num = Number(item.special_price) // The Number() only visualizes the type and is not needed
    var roundedString = num.toFixed(2);
    return (
      num != 0 ? <Text style={Style.pricespl}>Rs. {roundedString}</Text> : null
    );
  }

  renderView(items, type, title) {
    const { navigate } = this.props.navigation;
    return (
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={items}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ width: 150, marginRight: 10, borderRadius: 5}}
          onPress={() => navigate("TodaysSpecial", { id: type, title: title, callBack: this.callBack })}
          >
            <Image
              resizeMode="stretch"
              source={require("../../../assets/tilebg.jpg")}
            />
            <Image
              style={styles.imageTitle}
              source={{ uri: Constants.BASE_IMAGE_URL + item.small_image }}
            />
            <View style={{
              backgroundColor: "white", position: "absolute", bottom: 0, width: "100%", height: 60, flexDirection: "row",
              alignItems: "center"
            }}>
              <Text style={[Style.name, { width: 70, fontSize: width * 0.037, marginLeft: 5 }]}>{item.name}</Text>
              <View style={{ position: "absolute", right: 0, marginRight: 5 }}>
                {this.renderPrice(item)}
                {this.renderPriceSpl(item)}
              </View>
              </View>
            </TouchableOpacity>
        )}
        keyExtractor={item => item.product_id}
      />
    );
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.root}>
       {this.image}

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
            height: Platform.OS === 'ios' ? 64 : 50,
            alignItems: "center",
            justifyContent: "center",
            bottom: 0
          }}
        />

        <Image
          source={require("../../../assets/icon.png")}
          style={styles.headerTitle}
        />

        <View style={{ paddingLeft: 20, flex: 1, marginTop: 20, marginBottom: 20 }}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => navigate("TodaysSpecial", { id: -1, title: "Todays Special", callBack: this.callBack })}>
              <Text style={[styles.textHeader, {flex: 4}]}>Today's Special</Text>
              <Text style={[styles.textHeader, {flex: 1, fontSize: width * 0.037}]}>View More</Text>
            </TouchableOpacity>
            {this.renderView(this.state.data.slide3, -1, "Todays Special")}
          </View>
          <View style={{ flex: 1, marginTop: 10 }}>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center"  }}
              onPress={() => navigate("TodaysSpecial", { id: 3, title: "Vegetables", callBack: this.callBack })}
            >
              <Text style={[styles.textHeader, {flex: 4}]}>Vegetables</Text>
              <Text style={[styles.textHeader, {flex: 1, fontSize: width * 0.037}]}>View More</Text>
            </TouchableOpacity>
            {this.renderView(this.state.data.slide1, 3, "Vegetables")}
          </View>
          <View style={{ flex: 1, marginTop: 10 }}>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => navigate("TodaysSpecial", { id: 6, title: "Fruits", callBack: this.callBack })}
            >
              <Text style={[styles.textHeader, {flex: 4}]}>Fruits</Text>
              <Text style={[styles.textHeader, {flex: 1, fontSize: width * 0.037}]}>View More</Text>
            </TouchableOpacity>
            {this.renderView(this.state.data.slide2, 6, "Fruits")}
          </View>
        </View>
      </View>
    );
  }
}
