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
    height: 90,
    borderRadius: 5,
  },
  hor: {
    width: "100%",
    height: 40,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
  },
  paymentCard: {
    width: "93%",
    height: 90,
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
  statusButton: {
    backgroundColor: Color.green,
    width: "20%",
    borderRadius: 5
  },
  statusBtnText: {
    backgroundColor: "transparent",
    color: Color.white,
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
    fontSize: 15
  },
  name: {
    color: Color.darkgree,
    fontSize: 18,
    alignSelf: "center",
    fontWeight: "bold"
  },
  address: {
    marginTop: 10,
    color: Color.darkgree,
    fontSize: 18,

    fontWeight: "bold"
  },
  addtext: {
    marginTop: 10,
    color: Color.darkgree,
    fontSize: 14,

  },
  editIcon: {
    width: 20,
    height: 20,
  },
  radio: { left: -15, width: "50%", top: 5 },
  radio1: { width: "50%", top: 5 },
  productHeading: {
    color: Color.darkgree,
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center"
  },
  productItemText: {
    color: Color.darkgree,
    fontSize: 14,
    alignSelf: "center",
  }

};
