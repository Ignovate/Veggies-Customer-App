import React from "react";
import { Card, SearchBar } from "react-native-elements";
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
import Style from "./SearchStyle";
import { Color } from "../../styles/Color";
import Icon from "react-native-vector-icons/MaterialIcons";
import PropTypes from "prop-types";
import LinearGradient from "react-native-linear-gradient";
import IconAwesome from "react-native-vector-icons/FontAwesome";
import Service from "../../routes/service";
import SInfo from "react-native-sensitive-info";
import { Constants } from "../../utils/constants";
import RNShineButton from "react-native-shine-button";
import SideMenu from "../sideMenu/SideMenu";

export default class Search extends Base {
  constructor() {
    super();
    var flagNav;
    var quote_id;
    this._onIncreaseQuantity = this._onIncreaseQuantity.bind(this);
    this._onDecreaseQuantity = this._onDecreaseQuantity.bind(this);
    this._showProgress = this._showProgress.bind(this);
    this._hideProgress = this._hideProgress.bind(this);
    this._getCategorySuccess = this._getCategorySuccess.bind(this);
    this._onFailure = this._onFailure.bind(this);
    this.onSubmitBtn = this.onSubmitBtn.bind(this);
    this.addCardSuccess = this.addCardSuccess.bind(this);
    this.cardCount = this.cardCount.bind(this);
    this.addWishlistSuccess = this.addWishlistSuccess.bind(this);
    this._getCartSuccess = this._getCartSuccess.bind(this);
    this.state = {
      data: [
      ],
      wishlistIcon: "heart-o",
      itemUpdated: false,
      progrstatus: false,
      searchFlag: false,
      noFlag: true,
      startFlag: true
    };

    this.arrayholder = [];
    var countCart = 0;
    var cartValue = undefined;
  }

  componentDidMount() {
    SideMenu.fetchDetails();
    this.callBack();
  }

  callBack() {

    SInfo.getItem("quote_id", {}).then(value => {
      if (value != null) {
        Service.getInstance()._getCart(value, this, this._getCartSuccess, this._onFailure);
      }
    });

  }

  _getCartSuccess(responseData) {

    if (responseData != undefined) {
      if (responseData.messages == undefined) {
        var count = 0;
        if (responseData.items != undefined) {
          for (var i = 0; i < responseData.items.length; i++) {
            count = count + 1;
          }
          this.cartValue = responseData;
        } else {
          count = 0;
        }

        this.quote_id = responseData.quote_id;
        this.countCart = count;

        this.setState({
          count: count
        });
      }
    }
  }

  _getCategorySuccess(responseData) {
    if (responseData.length == 0) {
      this.setState({
        noFlag: true,
        startFlag: false
      });
    } else {
      this.setState({
        noFlag: false,
        startFlag: true
      });
      var parsedJson = [];

      for (var i = 0; i < responseData.length; i++) {
        var json = responseData[i]
        json.qty = 0;
        parsedJson.push(json)
      }

      this.arrayholder = parsedJson;

      this.setState({ data: parsedJson });
    }
  }

  SearchFilterFunction(text) {
    if (text.length == 0) {
      this.setState({ data: undefined, noFlag: true, startFlag: true });
    } else {
      SInfo.getItem("customer_id", {}).then(valueCustId => {
        SInfo.getItem("storeId", {}).then(value => {
          req = {
            api_key: Constants.CONSUMER_KEY_TEMP,
            customer_id: valueCustId,
            store_id: value,
            term: text
          }

          req = JSON.stringify(req)
          Service.getInstance()._search(req, this, this._getCategorySuccess, this._onFailure);
        });
      });
    }

  }

  _onFailure() { }

  addWishlistSuccess(responseData) {
    if (this.props.navigation.state.params.title == "Fresh List") {
      this.componentDidMount()
    }
    // if (responseData.status == "success")
    //   this._showAlert(responseData.message, "Ok");
  }

  _onIncreaseQuantity = (item, id) => {
    if (item.qty < 10) {
      this.setState({
        ["qty_" + id]: this.state["qty_" + id] + 1,
        itemUpdated: !this.state.itemUpdated
      });
      item.qty = item.qty + 1;
      // this.cardCount()
    }
  };

  _onDecreaseQuantity = (item, id) => {
    if (item.qty > 0) {
      this.setState({
        ["qty_" + id]: this.state["qty_" + id] - 1,
        itemUpdated: !this.state.itemUpdated
      });
      item.qty = item.qty - 1;
      // this.cardCount()
    }
  };

  cardCount() {
    var count = 0;

    if (this.countCart != undefined) {
      count = Number(this.countCart);
    }

    for (var i = 0; i < this.state.data.length; i++) {
      var data = this.state.data[i];
      if (data.qty != 0) {
        count = Number(count) + 1;
      }
    }

    this.setState({
      count: count
    });
  }

  onSubmitBtn(flag) {
    flagNav = flag;
    count = 0;
    var product = {};
    for (var i = 0; i < this.state.data.length; i++) {
      var data = this.state.data[i];
      if (data.qty != 0) {

        if (this.cartValue != undefined) {
          this.quote_id = this.cartValue.quote_id;
          for (var j = 0; j < this.cartValue.items.length; j++) {
            var oldData = this.cartValue.items[j];
            if (oldData.product_id == data.product_id) {
              product[oldData.product_id] = Number(oldData.qty) + Number(data.qty);
            } else {
              product[data.product_id] = data.qty;
            }
          }
        } else {
          product[data.product_id] = data.qty;
        }

        count = count + 1;
      }
    }

    if (count == 0) {
      this._showAlert("Please select minimum one item", "OK");
    } else {
      SInfo.getItem("customer_id", {}).then(valueCustId => {
        SInfo.getItem("storeId", {}).then(value => {
          var prodReq = JSON.stringify({ api_key: Constants.CONSUMER_KEY_TEMP, customer_id: valueCustId, store_id: value, product: product });
          console.log(prodReq);
          if (this.quote_id != undefined) {
            Service.getInstance()._updateCart(this.quote_id, prodReq, this, this.addCardSuccess, this._onFailure);
          } else {
            Service.getInstance()._createCart(prodReq, this, this.addCardSuccess, this._onFailure);
          }
        });
      });
    }
    // });
  }

  addCardSuccess(responseData) {
    // "messages":{"error":
    if (responseData.messages != undefined && responseData.messages != null) {
      this._showAlert(responseData.messages.error[0].message, "Ok");
    } else {
      const { navigate } = this.props.navigation;
      SInfo.setItem("cart_order", JSON.stringify(responseData), {});
      SInfo.setItem("quote_id", responseData.quote_id, {});
      this.quote_id = responseData.quote_id;
      if (!flagNav) {
        this.componentDidMount();
        // this.props.navigation.state.params.callBack();
        // this.props.navigation.goBack();
      } else {
        navigate("Basket", { callBack: this.callBack });
      }
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

  renderQty = (item, id) => {
    if (this.state["qty_" + id] == undefined)
      this.setState({
        ["qty_" + id]: 0
      });

    return (
      <View style={Style.qtyContainer}>
        {/* <TouchableOpacity > */}
        <IconAwesome
          size={25}
          color={Color.green}
          name="minus"
          onPress={() => this._onDecreaseQuantity(item, id)}
        />
        {/* </TouchableOpacity> */}
        <Text style={Style.quantityInput}>{item.qty}</Text>
        {/* <TouchableOpacity > */}
        <IconAwesome
          size={25}
          color={Color.green}
          name="plus"
          onPress={() => this._onIncreaseQuantity(item, id)}
        />
        {/* </TouchableOpacity> */}
      </View>
    );
  };

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
            height: Platform.OS === 'ios' ? 64 : 55,
            alignItems: "center",
            justifyContent: "center",
            bottom: 0
          }}
        >

          <SearchBar
            noIcon
            containerStyle={{ backgroundColor: Color.white, width: "89%", marginLeft: 40, marginTop: Platform.OS === 'ios' ? 20 : 2, height: 40 }}
            inputStyle={{ backgroundColor: Color.white, color: Color.darkgree, margin: Platform.OS === 'ios' ? 5 : 0  }}
            placeholderTextColor={Color.darkgree}
            onChangeText={(text) => this.SearchFilterFunction(text)}
            placeholder='Search For Freshness Starts Here.' />

        </LinearGradient>


        {this.state.noFlag ?
          <View style={Style.noOrder} >
            <Text style={[Style.pricespl, { fontSize: 20 }]}> {!this.state.startFlag ? "no matching items found" : "Search For Freshness Starts Here."} </Text></View> :
          <View style={{ flex: 1 }}>
            <FlatList
              style={{ marginBottom: 10 }}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={true}
              removeClippedSubviews={false}
              data={this.state.data}
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
                      <Text style={Style.name}>{item.name}</Text>

                      <View style={Style.priceStyle}>
                        <View style={{
                          flexDirection: "row",
                          alignItems: "center"
                        }}>
                          <Text style={Style.quantity}>1 kg </Text>
                          <View style={{ marginLeft: 30 }}>
                            {this.renderPrice(item)}
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

                    {this.renderQty(item, item.id)}
                  </View>
                </Card>
              )}
              keyExtractor={item => item.product_id}
            />
            {/* <View style={Style.bottomView}> */}
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={() => this.onSubmitBtn(false)} style={{ flex: 1 }}>
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
                  <Text style={Style.continueText}>Add To Basket</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.onSubmitBtn(true)} style={{ flex: 1 }}>
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
                  <Text style={Style.continueText}>Proceed</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            {this.state.progrstatus ? <Base /> : null}
            {/* </View> */}
          </View>
        }
      </View >
    );
  }
}
