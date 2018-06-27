import React from "react";
import { View, Text, TouchableOpacity, Image, FlatList, ScrollView, TextInput, Platform } from "react-native";
import Base from "../base";
import Style from "./ReviewOrderStyle";
import { Color } from "../../styles/Color";
import LinearGradient from "react-native-linear-gradient";
import SplashScreen from "react-native-splash-screen";
import { Card } from "react-native-elements";
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import Dash from 'react-native-dash';
import SInfo from "react-native-sensitive-info";
import Service from "../../routes/service";
import { Constants } from "../../utils/constants";
import IconAwesome from "react-native-vector-icons/FontAwesome";
import SideMenu from "../sideMenu/SideMenu";

export default class ReviewOrder extends Base {

  constructor() {
    super();
    var address = undefined;
    var localAdd = undefined;
    this.callBackAddress = this.callBackAddress.bind(this);
    this.onSubmitBtn = this.onSubmitBtn.bind(this);
    this._getCategorySuccess = this._getCategorySuccess.bind(this);
    this._onFailure = this._onFailure.bind(this);
    this._showProgress = this._showProgress.bind(this);
    this._hideProgress = this._hideProgress.bind(this);
  }

  componentDidMount() {
    SideMenu.fetchDetails();
  }

  componentWillMount() {
    if (this.props.navigation.state.params.cardData != undefined) {
      this.localAdd = this.props.navigation.state.params.cardData.customer.address[0];
      this.setState({
        data: this.props.navigation.state.params.cardData,
        order: this.localAdd
      });
    }

    // SInfo.getItem("address", {}).then(value => {
    //   if (value != null && value != "") {
    //     this.setState({
    //       order: JSON.parse(value),
    //     });
    //     this.localAdd = JSON.parse(value);
    //   }
    // });

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

  renderPrice = (price) => {
    var num = Number(price) // The Number() only visualizes the type and is not needed
    var roundedString = num.toFixed(2);
    if (roundedString == "NaN") {
      roundedString = "0.00"
    }
    return (
      <Text style={[Style.productItemText, { alignSelf: "flex-end", marginRight: 10 }]}>Rs. {roundedString}</Text>
    );
  }

  renderPriceWithDel = (price, dev) => {
    var num = Number(price) // The Number() only visualizes the type and is not needed
    var del = Number(dev)
    var total = num + del;
    var roundedString = total.toFixed(2);

    return (
      <Text style={[Style.productItemText, { fontWeight: "bold", alignSelf: "flex-end", marginRight: 10 }]}>Rs. {roundedString}</Text>
    );
  }

  callBackAddress(localAdd) {
    this.localAdd = localAdd;
    this.setState({ order: localAdd });
  }

  onSubmitBtn() {
    var delivermode, payment, deliveryCharge, address;
    if (this.state.deliveryCharge == undefined) {
      delivermode = this.state.data.shipping[0].value;
    } else {
      delivermode = this.state.deliveryCharge;
    }
    if (this.state.payment == undefined) {
      payment = this.state.data.payment[0].value;
    } else {
      payment = this.state.payment;
    }


    var address = {};
    if (this.state.order != undefined) {
      val = this.state.order;
      address["currency"] = "INR";
      address["is_app"] = 1;
      address["billing_address"] = {
        firstname: val.firstname,
        lastname: val.lastname,
        door_no: val.door_no,
        apt_name: val.apt_name,
        street_name: val.street_name,
        landmark: val.landmark,
        city: val.city,
        country_id: val.country_id,
        region: val.region,
        region_id: val.region_id,
        postcode: val.postcode,
        telephone: val.telephone,
        cus_email: val.cus_email,
        city_id: val.city_id
      };
      address["shipping_address"] = address.billing_address;
      address["shipping_method"] = delivermode;
      address["comment"] = val.customer_note;
    }

    var req;
    if (this.state.order != undefined) {
      SInfo.getItem("customer_id", {}).then(valueCustId => {
        // SInfo.getItem("storeId", {}).then(value => {

        var product = {};
        for (var i = 0; i < this.props.navigation.state.params.cardData.items.length; i++) {
          var data = this.props.navigation.state.params.cardData.items[i];
          product[data.product_id] = data.qty
        }

        req = {
          api_key: Constants.CONSUMER_KEY_TEMP,
          quote_id: this.props.navigation.state.params.cardData.quote_id,
          session: {
            customer_id: valueCustId, store_id: address.billing_address.city_id
          },
          items: product,
          payment: { method: payment },
          order: address
        };
        req = JSON.stringify(req)

        console.log(req);

        Service.getInstance()._processOrder(req, this, this._getCategorySuccess, this._onFailure);
      });
      // });
    } else {
      this._showAlert("Please fill the address to create order", "Ok");
    }

  }

  _getCategorySuccess(responseData) {
    if (responseData.messages != undefined) {
      this._showAlert(responseData.messages.error[0].message, "Ok");
    } else {
      SInfo.setItem("quote_id", "", {});
      SInfo.setItem("cart_order", "", {});
      // this.props.navigation.navigate("OrderPlaced", { message: responseData.success[0].message });
      this._moveToOrderPage();
    }
  }

  _onFailure() { }

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

        <ScrollView style={{ marginBottom: 60 }}>
          <Card containerStyle={Style.categoryCard}>
            <Text style={[Style.name, { marginBottom: 5 }]}>Shipping Address</Text>
            {
              this.state.order != undefined ?
                <View>
                  <Text style={Style.addtext}>{this.state.order.door_no} {this.state.order.street_name} {this.state.order.city},</Text>
                  <Text style={Style.addtext}>{this.state.order.region} - {this.state.order.postcode}</Text>
                  <IconAwesome
                    size={25}
                    color={Color.darkgree}
                    name="edit"
                    style={{ position: "absolute", right: 0, top: 0 }}
                    // onPress={() => navigate("NewAddress", { callBack: this.callBackAddress, address: this.localAdd })}
                    onPress={() => navigate("Address", { callBack: this.callBackAddress })}
                  />
                </View>
                :
                <View style={{ flexDirection: "row", alignContent: "center" }}>
                  <Text style={[Style.addtext, { alignSelf: "center" }]}>Please Add New Shipping Address</Text>
                  <IconAwesome
                    size={25}
                    color={Color.darkgree}
                    name="plus-circle"
                    style={{ marginLeft: 10 }}
                    // onPress={() => navigate("NewAddress", { callBack: this.callBackAddress, address: this.localAdd })}
                    onPress={() => navigate("NewAddress", { callBack: this.callBackAddress, flag: false, address: undefined })}
                  />
                </View>
            }
          </Card>

          <Card containerStyle={Style.deliveyCard}>
            <Text style={Style.name}>Mode of Delivery</Text>
            <View style={{ width: "100%", alignItems: "flex-start", marginTop: 10, marginBottom: 10 }}>
              <RadioForm
                radio_props={this.state.data.shipping}
                style={{ alignItems: "flex-start" }}
                initial={0}
                buttonSize={10}
                buttonOuterSize={20}
                buttonColor={'#036937'}
                labelStyle={{ fontSize: 12, color: '#036937' }}
                onPress={(value, index) => {
                  this.setState({
                    deliveryCharge: value,
                    deliveryRate: this.state.data.shipping[index].rate
                  })
                }}
              />
            </View>

            <Text style={Style.name}>Mode of Payment</Text>
            <View style={{ width: "100%", alignItems: "flex-start", marginTop: 10 }}>
              <RadioForm
                radio_props={this.state.data.payment}
                style={{ alignItems: "flex-start" }}
                buttonSize={10}
                buttonOuterSize={20}
                buttonColor={'#036937'}
                labelStyle={{ fontSize: 12, color: '#036937' }}
                onPress={(value, index) => {
                  this.setState({
                    payment: value,
                  })
                }}
              />
            </View>
          </Card>

          <Card containerStyle={[Style.itemCard]}>
            <View style={{
              width: "100%",
              flexDirection: "row", marginBottom: 10
            }}>
              <View style={{ flex: 1 }}>
                <Text style={[Style.productHeading, { alignSelf: "flex-start", marginLeft: 10 }]}>Products</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={Style.productHeading} > Units</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[Style.productHeading, { alignSelf: "flex-end", marginRight: 10 }]}>Price</Text>
              </View>
            </View>

            <FlatList
              data={this.state.data.items}
              renderItem={({ item }) => (

                <View style={{
                  width: "100%",
                  flexDirection: "row"
                }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[Style.productItemText, { alignSelf: "flex-start", marginLeft: 10 }]}>{item.product_name}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={Style.productItemText}>{item.qty} kg</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    {this.renderPrice(item.row_total)}
                  </View>
                </View>

              )}
              keyExtractor={item => item.product_id}
            />

            <Dash style={{ width: "100%", height: 1, marginTop: 10, marginBottom: 10 }} />
            <View style={{ flexDirection: "row" }}>

              <View style={{ flex: 1 }}>
                <Text style={[Style.productItemText, {alignSelf: "flex-end" }]}>Item Total</Text>
              </View>
              <View style={{ flex: 1 }}>
                {this.renderPrice(this.state.data.subtotal)}
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>

              <View style={{ flex: 1 }}>
                <Text style={[Style.productItemText, { alignSelf: "flex-end" }]}>Tax</Text>
              </View>
              <View style={{ flex: 1 }}>
                {this.renderPrice(this.state.data.tax_amount)}
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>

              <View style={{ flex: 1 }}>
                <Text style={[Style.productItemText, { alignSelf: "flex-end" }]}>Delivery Charge</Text>
              </View>
              <View style={{ flex: 1 }}>
                {this.renderPrice(this.state.deliveryRate != undefined ? this.state.deliveryRate : this.state.data.shipping[0].rate)}
              </View>
            </View>
            <Dash style={{ width: "100%", height: 1, marginTop: 10, marginBottom: 10 }} />
            <View style={{ flexDirection: "row" }}>

              <View style={{ flex: 1 }}>
                <Text style={[Style.productItemText, {alignSelf: "flex-end", fontWeight: "bold" }]}>Grand Total</Text>
              </View>
              <View style={{ flex: 1 }}>
                {this.renderPriceWithDel(this.state.data.grand_total, this.state.deliveryRate != undefined ? this.state.deliveryRate : this.state.data.shipping[0].rate)}
              </View>
            </View>
            {/* <View style={{ flexDirection: "row" }}>
              <Text style={[Style.productItemText, { marginLeft: "45%", fontSize: 16 }]}>You Saved</Text>
              {this.renderPrice(this.state.discount_amount)}
            </View> */}
          </Card>
        </ScrollView>
        <TouchableOpacity onPress={this.onSubmitBtn} style={{
          position: "absolute",
          bottom: 0, width: "100%"
        }}>
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
              height: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >

            <Text style={Style.placeOrderText}>Place Order </Text>

          </LinearGradient>
        </TouchableOpacity>
        {this.state.progrstatus ? <Base /> : null}
      </View >
    );
  }
}
