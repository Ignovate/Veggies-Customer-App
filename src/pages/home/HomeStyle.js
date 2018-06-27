import { StyleSheet, Dimensions, Platform } from "react-native";
import { Color } from "../../styles/Color";

const screenWidth = Dimensions.get("window").width;
export default {
  root: {
    backgroundColor: "white",
    flex: 1
  },
  headerTitle: {
    flex: 1,
    alignSelf: "center",
    resizeMode: "center",
    position: "absolute",
    ...Platform.select({
      ios: {
        height: 60,
        width: 70,
        marginTop: 20
      },
      android: {
        height: 80,
        width: 90,
      }
    }),
  },
  bg: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  item: {
    flex: 1,
    resizeMode: "stretch",
    width: "100%"
  },
  textHeader: {
    color: Color.darkgree,
    fontSize: 20,
    fontWeight: "bold", marginBottom: 10
  },
  imageTitle: {
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
    top: 0,
    marginTop: "5%",
    position: "absolute",
    alignSelf: "center"
  },
};
