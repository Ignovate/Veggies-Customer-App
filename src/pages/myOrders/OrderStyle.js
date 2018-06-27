import { StyleSheet } from "react-native";
import { Color } from "../../styles/Color";

export default StyleSheet.create({
  root: {
    backgroundColor: Color.white,
    flex: 1
  },
  bg: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  categoryCard1: {
    width: "92%",
    borderRadius: 5,
  },
  categoryCard: {
    flexDirection: "row",
    justifyContent: "space-between"
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
    fontSize: 12
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: Color.black
  },
  price: {
    color: Color.darkgree,
    fontSize: 16,
    fontWeight: "normal",
    alignContent: "center",
  },
  noOrder: {
    position: "absolute",
    top: 0, bottom: 0, left: 0, right: 0, justifyContent: "center", alignItems: "center"
  }
});
