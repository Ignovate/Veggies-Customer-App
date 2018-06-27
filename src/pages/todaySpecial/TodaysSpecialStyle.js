import { StyleSheet, Platform } from "react-native";
import { Color } from "../../styles/Color";
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default {
  root: {
    flex: 1
  },
  bg: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  categoryCard: {
    width: "92%",
    height: 120,
    borderRadius: 5,
  },
  cardView: {
    height: "100%",
    width: "100%",
    flexDirection: "row",
  },
  imageCircle: {
    alignContent: "center",
    marginRight: 5,
    ...Platform.select({
      ios: {
        height: 60,
        width: 60,
        borderRadius: 30,
      },
      android: {
        height: 60,
        width: 60,
        borderRadius: 60,
      }
    }),
  },
  name: {
    color: Color.green,
    fontSize: 16,
    fontWeight: "bold"
  },
  price: {
    textDecorationLine: "line-through",
    color: Color.green,
    fontSize: width * 0.037,
    fontWeight: "normal",
    alignContent: "center",
  },
  quantity: {
    color: Color.green,
    fontSize: 18,
    fontWeight: "bold"
  },
  noOrder: {
    position: "absolute",
    top: 0, bottom: 0, left: 0, right: 0, justifyContent: "center", alignItems: "center"
  },
  pricespl: {
    color: Color.green,
    fontSize: width * 0.037,
    fontWeight: "normal",
    alignContent: "center",
  },
  priceTotal: {
    color: Color.white,
    fontSize: width * 0.037,
    fontWeight: "normal",
    alignContent: "center",
  },
  nameStyle: {
    marginTop: "2%",
    marginLeft: "2%"
  },
  priceStyle: {
    width: 120,
    height: 50,
    bottom: 0,
    position: "absolute",
  },
  favStyle: {
    right: 0,
    top: 0,
    position: "absolute",
  },
  delStyle: {
    left: 0,
    bottom: 0,
    position: "absolute",
  },
  ddStyle: {
    width: "80%",
    height: "40%",
    marginTop: 10,
    backgroundColor: Color.lightGray,
    alignContent: "center"
  },
  bottomView: {
    width: "100%",
    height: 60,
    backgroundColor: "#FF9800",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0
  },
  continueText: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center"
  },
  qtyContainer: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "25%",
    bottom: 20,
    padding: 5,
    right: 0,
    position: "absolute",
    backgroundColor: Color.yellow,
  },
  qtyActionButton: {},
  qtyIcon: {
    marginRight: 0,
    alignSelf: "center"
  },
  quantityInput: {
    color: Color.green,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18
  },
  minusStyle: {
  },
  plusStyle: {
  },
  savedStyle: {
    flexDirection: "row"
  },
  savedText: {
    fontSize: 14,
    marginTop: 5
  },
  TextInputStyleClass: {
    height: 50,
    backgroundColor: "#FFFFFF",
    fontWeight: "normal",
  },
  rightIcon: {
    color: Color.white,
    marginLeft: 10
  },
  rightlastIcon: {
    color: Color.white
  },
};
