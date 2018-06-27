import React from "react";
import { Card } from "react-native-elements";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Platform
} from "react-native";
import Base from "../base";
import Style from "../todaySpecial/TodaysSpecialStyle";
import { Color } from "../../styles/Color";
import Icon from "react-native-vector-icons/MaterialIcons";
import PropTypes from "prop-types";
import LinearGradient from "react-native-linear-gradient";
import IconAwesome from "react-native-vector-icons/FontAwesome";
import BasStyle from "./BasketStyle";
import SInfo from "react-native-sensitive-info";
import Service from "../../routes/service";
import RNShineButton from "react-native-shine-button";
import { Constants } from "../../utils/constants";
import SideMenu from "../sideMenu/SideMenu";

export default class Basket extends Base {
  static instance;
  constructor(props) {
    super(props);
    instance = this;
    this.state = {
      data: [],
      quantity: 0,
      count: 0,
      wishlistIcon: "heart-o"
    };
    this._showProgress = this._showProgress.bind(this);
    this._hideProgress = this._hideProgress.bind(this);
    this._getCartSuccess = this._getCartSuccess.bind(this);
    this._onFailure = this._onFailure.bind(this);
    this.addWishlistSuccess = this.addWishlistSuccess.bind(this);
    this.removeItemSuccess = this.removeItemSuccess.bind(this);
    this.onSubmitBtn = this.onSubmitBtn.bind(this);
    this.addCardSuccess = this.addCardSuccess.bind(this);
  }

  componentDidMount() {
    SideMenu.fetchDetails();
    SInfo.getItem("quote_id", {}).then(value => {
      if (value != null) {
        Service.getInstance()._getCart(value, this, this._getCartSuccess, this._onFailure);
      } else {
        this.setState({
          noFlag: true
        });
      }
    });
  }

  _onFailure() { }

  addWishlistSuccess(responseData) {
    // if (responseData.status == "success")
    //   this._showAlert(responseData.message, "Ok");
  }

  removeItemSuccess(responseData) {
    this.componentDidMount();
    this.props.navigation.state.params.callBack();
  }

  _getCartSuccess(responseData) {
    if (responseData != undefined) {
      if (responseData.messages != undefined) {
        this.setState({
          noFlag: true
        });
      } else {
        count = 0;
        SInfo.setItem("quote_id", responseData.quote_id, {});
        SInfo.setItem("cart_order", JSON.stringify(responseData), {});
        if (responseData.items != undefined) {
          value = responseData;
          for (var i = 0; i < responseData.items.length; i++) {
            count = count + 1;
          }
        } else {
          count = 0;
        }

        this.setState({ data: responseData });

        this.setState({
          count: count
        });

        // this.props.navigation.setParams({ count: count });
      }
    }
  }

  onSubmitBtn() {
    count = 0;
    var product = {};
    flagCart = false;
    if (value != "null" && value != undefined && value != "") {
      flagCart = true;
      quote_id = value.quote_id;
      for (var i = 0; i < value.items.length; i++) {
        var data = value.items[i];
        product[data.product_id] = data.qty;
      }
    }

    for (var i = 0; i < this.state.data.length; i++) {
      var data = this.state.data[i];
      if (data.qty != 0) {
        if (flagCart) {
          product[data.product_id] = Number(product[data.product_id]) + data.qty;
        } else {
          product[data.product_id] = data.qty;
        }
      }
    }
    SInfo.getItem("customer_id", {}).then(valueCustId => {
      SInfo.getItem("storeId", {}).then(value => {
        var prodReq = JSON.stringify({ api_key: Constants.CONSUMER_KEY_TEMP, customer_id: valueCustId, store_id: value, product: product });
        // if (flagCart) {
        Service.getInstance()._updateCart(quote_id, prodReq, this, this.addCardSuccess, this._onFailure);
        // } else {
        //   this.props.navigation.navigate("ReviewOrder", { cardData: this.state.data })
        // }
      });
    });

  }

  addCardSuccess(responseData) {
    if (responseData.messages != undefined) {
      this._showAlert(responseData.messages.error[0].message, "Ok");
    } else {
      console.log(responseData)
      this.props.navigation.navigate("ReviewOrder", { cardData: responseData })
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


  _onIncreaseQuantity = (item, id) => {
    if (item.qty < 10) {
      this.setState({
        ["qty_" + id]: this.state["qty_" + id] + 1,
        itemUpdated: !this.state.itemUpdated
      });
      item.qty = item.qty + 1;
    }
  };

  _onDecreaseQuantity = (item, id) => {
    if (item.qty > 1) {
      this.setState({
        ["qty_" + id]: this.state["qty_" + id] - 1,
        itemUpdated: !this.state.itemUpdated
      });
      item.qty = item.qty - 1;
    }
  };

  renderQty = (item, id) => {
    if (this.state["qty_" + id] == undefined)
      this.setState({
        ["qty_" + id]: 0
      });

    return (
      <View style={Style.qtyContainer}>
        <TouchableOpacity onPress={() => this._onDecreaseQuantity(item, id)}>
          <IconAwesome
            size={20}
            color={Color.green}
            name="minus"
          />
        </TouchableOpacity>
        <Text style={Style.quantityInput}>{item.qty}</Text>
        <TouchableOpacity onPress={() => this._onIncreaseQuantity(item, id)}>
          <IconAwesome
            size={20}
            color={Color.green}
            name="plus"
          />
        </TouchableOpacity>
      </View>
    );
  };

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
    var num = Number(item.base_price) // The Number() only visualizes the type and is not needed
    var roundedString = num.toFixed(2);

    return (
      num != 0 ? <Text style={Style.pricespl}>Rs. {roundedString}</Text> : null
    );
  }
  renderTotal = (item) => {
    var num = Number(item.grand_total) // The Number() only visualizes the type and is not needed
    var roundedString = num.toFixed(2);
    if (roundedString == "NaN") {
      roundedString = "0"
    }
    return (
      roundedString != "0" ? <Text style={Style.priceTotal}>Rs. {roundedString}</Text> : null
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
        >
        <View style={{
          right: 0,
          marginRight: 20,
          top: 0,
          marginTop: Platform.OS === 'ios' ?  25 : 12,
          position: "absolute", 
          flexDirection: "row"
        }}>
            <View style={{ marginRight: 5 }}>
              <IconAwesome
                size={35}
                color={Color.white}
                name="cart-plus"
                style={Style.rightlastIcon}
              />
              {this.state.count ?
                <View style={{
                  backgroundColor: "red", position: "absolute", right: 0, top: 0, width: 20, height: 20
                }}>
                  <Text style={{ color: "white", fontWeight: "bold", alignSelf: "center" }}>{this.state.count}</Text>
                </View> : null
              }
            </View>
            <View>
              <Text style={Style.priceTotal}>{this.state.count} Items</Text>
              {this.renderTotal(this.state.data)}
            </View>
          </View>

        </LinearGradient>

        {this.state.noFlag ?
          <View style={BasStyle.noOrder} >
            <Text style={[Style.pricespl, { fontSize: 20 }]}>No Orders in Basket</Text></View> :
          <View style={{ flex: 1 }}>
            <FlatList style={{ marginBottom: 60 }}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={true}
              data={this.state.data.items}
              extraData={this.state.itemUpdated}
              renderItem={({ item }) => (
                <Card containerStyle={Style.categoryCard}>
                  <View style={Style.cardView}>

                    <Image
                      resizeMode="center"
                      style={Style.imageCircle}
                      source={{ uri: Constants.BASE_IMAGE_URL + item.small_image }}
                    />
                    <View style={Style.nameStyle}>
                      <Text style={Style.name}>{item.product_name}</Text>

                      <View style={Style.priceStyle}>
                        <View style={{
                          flexDirection: "row",
                          alignItems: "center"
                        }}>
                          <Text style={Style.quantity}>1 kg </Text>
                          <View style={{ marginLeft: 30 }}>

                            {this.renderPriceSpl(item)}
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={Style.favStyle}>
                      <RNShineButton
                        shape={"heart"}
                        color={"#808080"}
                        fillColor={"#ff0000"}
                        value={item.is_wishlist == 0 ? false : true}
                        size={20}
                        width={28}
                        height={25}
                        onChange={() => {
                          if (item.is_wishlist == 0) {
                            item.is_wishlist = 1;
                            reqVal = JSON.stringify({
                              "product_id": item.product_id
                            });
                            Service.getInstance()._setWishlist(reqVal, this, this.addWishlistSuccess, this._onFailure)
                          } else {
                            item.is_wishlist = 0;
                            Service.getInstance()._removeWishlist(item.product_id, this, this.addWishlistSuccess, this._onFailure)
                          }

                        }}
                      />
                    </View>
                    <View style={Style.delStyle}>
                      <IconAwesome
                        size={20}
                        color={Color.darkgree}
                        name="trash"
                        onPress={() => {
                          Service.getInstance()._removeCartItem(value.quote_id, item.item_id, instance, instance.removeItemSuccess, instance._onFailure)
                        }}
                      />
                    </View>
                    {this.renderQty(item, item.id)}
                  </View>

                </Card>
              )}
              keyExtractor={item => item.product_id}
            />

            <TouchableOpacity onPress={() => {
              this.onSubmitBtn()
            }}
              style={{
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

                <Text style={[Style.continueText, { fontSize: 20 }]}>Check Out </Text>

              </LinearGradient>
            </TouchableOpacity>
          </View>
        }
        {this.state.progrstatus ? <Base /> : null}
      </View >
    );
  }
}
