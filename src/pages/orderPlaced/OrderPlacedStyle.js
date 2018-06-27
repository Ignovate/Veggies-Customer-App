import { StyleSheet } from "react-native";
import { Color } from "../../styles/Color";

export default StyleSheet.create({
  root: {
    flex: 1
  },
  bg: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  successText: {
    fontWeight: "bold",
    textAlign: "left",
    color: Color.darkgree,
    fontSize: 30,
    marginTop: "80%",
    alignSelf: "center"
  },
  emailText: {
  
    fontWeight: "bold",
    color: Color.darkgree,
    fontSize: 20,
    marginLeft: 20,
    marginTop:10,
    alignSelf: "center"
  }
});
