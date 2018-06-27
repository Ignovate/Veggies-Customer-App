import { StyleSheet, Platform } from "react-native";
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
  Card: {
    flex: 1,
    width: "93%",
    borderRadius: 5,
  },
  topContainer: {
    width: "100%",
  },
  heading: {
    color: Color.darkgree,
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 5
  },
  nameContainer: {
    flexDirection: "row"
  },
  firstName: {
    flex:1,
    fontSize: 14,
    width: "50%",
    color:Color.darkgree,
    ...Platform.select({
      ios: {
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: Color.darkgree
      }
    }),
  },
  contactNo: {
    fontSize: 14,
    width: "100%",
    color:Color.darkgree,
    ...Platform.select({
      ios: {
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: Color.darkgree
      }
    }),
  },
  nickNameContainer: {
    flexDirection: "row",
    width: "80%"
  },
  nickButton: {
    backgroundColor: Color.gray,
    alignContent: "center",
    justifyContent: "center",
    height: "20%",
    width: "30%",
    margin: 5
  },
  nickText: {
    backgroundColor: "transparent",
    color: Color.white,
    fontWeight: "bold",
    alignSelf: "center",
    fontSize: 15
  },
  receiveText: {
    marginLeft: 5,
    fontSize: 18
  },
  placeOrderText: {
    color: "#fff",
    fontSize: 20
  },
  addtext: {
    marginTop: 5,
    color: Color.darkgree,
    fontSize: 12,
  },
};
