import { StyleSheet } from "react-native";
import { Color } from "../../styles/Color";

export default StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center"
  },

  textInput1: {
    alignSelf: "center",
    width: "60%",
    height: 35,
    fontSize: 15,
    marginBottom: "2%",
    backgroundColor: "white",
    paddingLeft: "5%",
  },

  otpText: {
    alignSelf: "center",
    backgroundColor: "transparent",
    fontSize: 20,
    marginBottom: "5%",
    fontWeight: "bold",
    color: Color.green
    
  },
  codeInput:{
    backgroundColor: Color.white,
    alignSelf: "center",
    width:"50%",
    height:50
  },
  resendText: {
    alignSelf: "center",
    backgroundColor: "transparent",
    fontSize: 18,
    marginTop:20,
    color: Color.darkgree
  },

  submit: {
    backgroundColor: "transparent",
    fontSize: 18,
    color: "rgba(255,255,255,1)"
  },

  button2: {
    width: "60%",
    height: 40,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: Color.red,
    borderRadius: 3,
   marginTop:30
  },
  bg1: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.70,
  },
});
