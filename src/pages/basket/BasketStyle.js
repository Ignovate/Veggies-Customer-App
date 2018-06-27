import { StyleSheet } from "react-native";
import { Color } from "../../styles/Color";
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default {
  price: {
    color: Color.Black,
    fontSize: 20,
    fontWeight: "bold",
    alignContent: "center",
    marginTop: "25%",
    marginLeft: "5%"
  },
  quantity: {
    color: Color.Black,
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: Color.lightGray,
    width: "40%",
    height: "40%",
    marginTop: 10
  },
  productItemText: {
    color: Color.darkgree,
    fontSize: 14,
    alignSelf: "center",
  }, pricespl: {
    color: Color.green,
    fontSize: width * 0.037,
    fontWeight: "normal",
    alignContent: "center",
  },
  noOrder: {
    position: "absolute",
    top: 0, bottom: 0, left: 0, right: 0, justifyContent: "center", alignItems: "center"
  }
};
