import React from "react";
import { View, Text, TouchableOpacity, FlatList, Image, Platform } from "react-native";
import { Card } from "react-native-elements";
import Base from "../base";
import { Color } from "../../styles/Color";
import Icon from "react-native-vector-icons/MaterialIcons";
import Style from "./OrderStyle";
import LinearGradient from "react-native-linear-gradient";
import Service from "../../routes/service";
// import dateFormat from "dateformat";
import SideMenu from "../sideMenu/SideMenu";
import SplashScreen from "react-native-splash-screen";

export default class Order extends Base {
  constructor() {
    super();
    this._showProgress = this._showProgress.bind(this);
    this._hideProgress = this._hideProgress.bind(this);
    this._getCategorySuccess = this._getCategorySuccess.bind(this);
    this._getOrderSuccess = this._getOrderSuccess.bind(this);
    this._onFailure = this._onFailure.bind(this);
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

  componentDidMount() {
    SplashScreen.hide()
    SideMenu.fetchDetails();
    Service.getInstance()._getOrders(this, this._getCategorySuccess, this._onFailure);
  }

  _getCategorySuccess(responseData) {
    if (responseData.length == 0) {
      this.setState({
        noFlag: true
      });
    } else {
      this.setState({ data: responseData, noFlag: false });
    }
  }

  _getOrderSuccess(responseData) {
    const { navigate } = this.props.navigation
    navigate("OrderDetails", { data: responseData })
  }

  _onFailure() { }

  // _getParsedDate(datVale) {
  //   console.log(dateFormat(datVale, "fullDate"));
  //   return (
  //     <Text style={{
  //       marginTop: 10, fontSize: 14,
  //     }}>Ordered on {dateFormat(datVale, "fullDate")} at {dateFormat(datVale, "h:MM TT")}</Text>
  //   );
  // }

  renderPrice = (price) => {
    var num = Number(price) // The Number() only visualizes the type and is not needed
    var roundedString = num.toFixed(2);
    return (
      <Text style={Style.price}>Rs {roundedString}</Text>
    );
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
        {this.state.noFlag ?
          <View style={Style.noOrder} >
            <Text style={[Style.price, { fontSize: 20 }]}>No Orders Placed</Text></View> :
          <FlatList style={{ marginBottom: 10 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={true}
            data={this.state.data}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => {
                // navigate("OrderDetails", { id: item.order_id })
                Service.getInstance()._getOrdersDetails(item.order_id, this, this._getOrderSuccess, this._onFailure);
              }}
              >
                <Card containerStyle={Style.categoryCard1}>
                  <View style={Style.categoryCard}>
                    <Text style={Style.price}>{item.increment_id}</Text>
                    <TouchableOpacity style={Style.statusButton}>
                      <Text style={Style.statusBtnText}>{item.status}</Text>
                    </TouchableOpacity>
                    {this.renderPrice(item.total)}
                  </View>
                  {/* <Text style={{
                    marginTop: 10, fontSize: 14,
                  }}>{item.area}</Text> */}
                  {/* {this._getParsedDate(item.ordered_date)} */}
                  <Text style={{
                    marginTop: 10, fontSize: 14
                  }}>Ordered on {item.ordered_date}</Text>
                </Card>
              </TouchableOpacity>
            )}

            keyExtractor={item => item.order_id}
          />
        }
        {this.state.progrstatus ? <Base /> : null}
      </View>
    );
  }
}
