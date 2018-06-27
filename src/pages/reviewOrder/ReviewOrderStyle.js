import { StyleSheet } from "react-native";
import { Color } from "../../styles/Color";

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
    width: "93%",
    borderRadius: 5,
  },
  deliveyCard: {
    width: "93%",
    borderRadius: 5,
  },
  paymentCard: {
    width: "93%",
    borderRadius: 5,
  },
  itemCard: {
    flex: 1,
    width: "93%",
    borderRadius: 5,
  },
  placeOrderText: {
    color: "#fff",
    fontSize: 25,
  },
  name: {
    color: Color.darkgree,
    fontSize: 14,
    fontWeight: "bold"
  },
  address: {
    marginTop: 10,
    color: Color.darkgree,
    fontSize: 16,
    fontWeight: "bold"
  },
  addtext: {
    marginTop: 5,
    color: Color.darkgree,
    fontSize: 12,
    marginRight: 30
  },
  editIcon: {
    width: 20,
    height: 20,
  },
  radio: { left: -15, width: "50%", top: 5 },
  radio1: { width: "50%", top: 5 },
  productHeading: {
    color: Color.darkgree,
    fontSize: 14,
    fontWeight: "bold",
    alignSelf: "center"
  },
  productItemText: {
    color: Color.darkgree,
    fontSize: 12,
    alignSelf: "center",
  },
  firstName: {
    fontSize: 14,
    width: "50%",
    color: Color.darkgree
  }
};
