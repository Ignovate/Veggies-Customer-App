import React, { Component } from "react";
import { View, Text, Image } from "react-native";
import IconAwesome from "react-native-vector-icons/FontAwesome";
import { Color } from "../styles/Color";
import { StackNavigator } from "react-navigation";
import Login from "../pages/login";
import Verification from "../pages/Verification/Verification";
import DrawerButton from "../utils/DrawerButton";
import Home from "../pages/home/Home";
import TodaysSpecial from "../pages/todaySpecial/TodaysSpecial";
import Basket from "../pages/basket/Basket";
import ReviewOrder from "../pages/reviewOrder/ReviewOrder";
import OrderDetails from "../pages/myOrders/OrderDetails";
import ChangeAddress from "../pages/changeAddress/ChangeAddress";
import NewAddress from "../pages/newAddress/NewAddress";
import Address from "../pages/newAddress/Address";
import OrderPlaced from "../pages/orderPlaced/OrderPlaced";
import Order from "../pages/myOrders/Order";
import Notification from "../pages/notification/Notification";
import Style from "../styles/Style";
import LinearGradient from "react-native-linear-gradient";
import City from "../pages/City/City";
import Search from "../pages//Search/Search"

export const stackNavigator = (signedIn = false) => {

  renderCount = (title, item, flag, navigation) => {
    return (
      <View style={Style.headerView}>
        <IconAwesome
          size={35}
          color={Color.white}
          name="cart-plus"
          style={Style.rightlastIcon}
          onPress={() => {
            if (item != 0) {
              navigation.navigate("Basket", { callBack: navigation.state.params.callBack });
            }
          }}
        />
        {item ?
          <View style={{
            backgroundColor: "red", position: "absolute", top: 0, marginLeft: 25, width: 20, height: 20
          }}>
            <Text style={{ color: "white", fontWeight: "bold", alignSelf: "center" }}>{item}</Text>
          </View> : null
        }
        {this.renderSearch(flag)}

      </View>
    );
  }

  renderSearch = (flag) => {
    return (
      <IconAwesome
        size={30}
        color={Color.white}
        name="search"
        style={Style.rightIcon}
        onPress={() => {
          TodaysSpecial.searchMethod(!flag)
        }}
      />
    );
  }


  return StackNavigator(
    {
      login: {
        screen: Login,
        navigationOptions: {
          headerLeft: null,
          drawerLockMode: "locked-closed"
        }
      },
      city: {
        screen: City,
        navigationOptions: {
          headerLeft: null,
          drawerLockMode: "locked-closed"
        }
      },
      Home: {
        screen: Home,
        navigationOptions: ({ navigation }) => ({
          headerLeft: (
            <DrawerButton navigation={navigation} />),
          headerStyle: Style.titleHeader,
          headerRight: (
            <IconAwesome
              size={25}
              color={Color.white}
              name="search"
              style={Style.rightIcon}
              onPress={() => {
                navigation.navigate("Search")
              }}
            />
          )
        })
      },

      Verification: {
        screen: Verification,
        navigationOptions: {
          headerLeft: null,
          drawerLockMode: "locked-closed",
        }
      },

      TodaysSpecial: {
        screen: TodaysSpecial,
        navigationOptions: ({ navigation }) => ({
          // title: navigation.state.params.title,
          headerTitleStyle: { textAlign: 'left', alignSelf: 'center' },
          headerLeft: (
            <View style={Style.headerView}>
              <IconAwesome
                size={40}
                color={Color.white}
                name="angle-left"
                style={Style.icons}
                onPress={() => {
                  navigation.goBack();
                }}
              />
              <Text style={Style.navigationTitle}>{navigation.state.params.title}</Text>
            </View>
          ),
          headerStyle: Style.titleHeader,
          headerRight: (
            this.renderCount(navigation.state.params.title, navigation.state.params.count, navigation.state.params.flag, navigation)
          )
        })
      },
      Basket: {
        screen: Basket,
        navigationOptions: ({ navigation }) => ({
          headerLeft: (
            <View style={Style.headerView}>
              <IconAwesome
                size={30}
                color={Color.white}
                name="angle-left"
                style={Style.icons}
                onPress={() => {
                  navigation.goBack();
                }}
              />
              <Text style={Style.navigationTitle}>Fresh Basket</Text>
            </View>
          ),
          headerStyle: Style.titleHeader,
        })
      },
      ReviewOrder: {
        screen: ReviewOrder,
        navigationOptions: ({ navigation }) => ({
          headerLeft: (
            <View style={Style.headerView}>
              <IconAwesome
                size={30}
                color={Color.white}
                name="angle-left"
                style={Style.icons}
                onPress={() => {
                  navigation.goBack();
                }}
              />
              <Text style={Style.navigationTitle}>Review Order</Text>
            </View>
          ),
          headerStyle: Style.titleHeader,
        })
      },
      OrderDetails: {
        screen: OrderDetails,
        navigationOptions: ({ navigation }) => ({
          headerLeft: (
            <View style={Style.headerView}>
              <IconAwesome
                size={30}
                color={Color.white}
                name="angle-left"
                style={Style.icons}
                onPress={() => {
                  navigation.goBack();
                }}
              />
              <Text style={Style.navigationTitle}>Order Details</Text>
            </View>
          ),
          headerStyle: Style.titleHeader,
        })
      },
      ChangeAddress: {
        screen: ChangeAddress,
        navigationOptions: ({ navigation }) => ({
          headerLeft: (
            <View style={Style.headerView}>
              <IconAwesome
                size={40}
                color={Color.black}
                name="angle-left"
                style={Style.icons}
                onPress={() => {
                  navigation.goBack();
                }}
              />
              <Text style={Style.navigationTitle}>Change Address</Text>
            </View>
          ),
          headerStyle: Style.navigationHeader
        })
      },
      NewAddress: {
        screen: NewAddress,
        navigationOptions: ({ navigation }) => ({
          headerLeft: (
            <View style={Style.headerView}>
              <IconAwesome
                size={30}
                color={Color.white}
                name="angle-left"
                style={Style.icons}
                onPress={() => {
                  navigation.goBack();
                }}
              />
              <Text style={Style.navigationTitle}>Add Address</Text>
            </View>
          ),
          headerStyle: Style.titleHeader,
        })
      },
      Address: {
        screen: Address,
        navigationOptions: ({ navigation }) => ({
          headerLeft: (
            <View style={Style.headerView}>
              <IconAwesome
                size={30}
                color={Color.white}
                name="angle-left"
                style={Style.icons}
                onPress={() => {
                  navigation.goBack();
                }}
              />
              <Text style={Style.navigationTitle}>Add Address</Text>
            </View>
          ),
          headerStyle: Style.titleHeader,
        })
      },
      OrderPlaced: {
        screen: OrderPlaced,
        navigationOptions: {
          headerLeft: null
        }
      },
      Order: {
        screen: Order,
        navigationOptions: ({ navigation }) => ({
          headerLeft: (
            <View style={Style.headerView}>
              <IconAwesome
                size={40}
                color={Color.white}
                name="angle-left"
                style={Style.icons}
                onPress={() => {
                  navigation.goBack();
                }}
              />
              <Text style={Style.navigationTitle}>Fresh Orders</Text>
            </View>
          ),
          headerStyle: Style.titleHeader
        })
      },
      Notification: {
        screen: Notification,
        navigationOptions: ({ navigation }) => ({
          headerLeft: (
            <View style={Style.headerView}>
              <IconAwesome
                size={40}
                color={Color.white}
                name="angle-left"
                style={Style.icons}
                onPress={() => {
                  navigation.goBack();
                }}
              />
              <Text style={Style.navigationTitle}>Notification</Text>
            </View>
          ),
          headerStyle: Style.titleHeader
        })
      },
      Search: {
        screen: Search,
        navigationOptions: ({ navigation }) => ({
          headerLeft: (
            <View style={Style.headerView}>
              <IconAwesome
                size={40}
                color={Color.white}
                name="angle-left"
                style={Style.icons}
                onPress={() => {
                  navigation.goBack();
                }}
              />
              {/* <Text style={Style.navigationTitle}>Search</Text> */}
            </View>
          ),
          headerStyle: Style.titleHeader
        })
      }
    },
    {
      initialRouteName: signedIn ? "Home" : "login",
      headerMode: "screen",
      cardStyle: {
        backgroundColor: "transparent"
      }
    }
  );
};

export default stackNavigator;
