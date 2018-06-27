import { Platform,StyleSheet } from "react-native";
import { Color } from "../styles/Color";

export default StyleSheet.create({
  headerView: {
    flexDirection: "row"
  },
  headerTitle: {
    flex: 1,
    alignSelf: "center",
    resizeMode: "center",
    height: 50,
    width: 50
  },
  titleHeader: {
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 100,
    top: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        borderBottomWidth: 0
      }
    }),
  },
  navigationTitle: {
    fontWeight: "200",
    fontSize: 18,
    color: Color.white,
    alignSelf: "center",
    marginLeft: 15,
  },
  navigationHeader: {
    elevation: 0,
    shadowOpacity: 0,
    shadowColor: "transparent",
    backgroundColor: Color.white,
    borderBottomWidth: 0
  },
  icons: {
    padding: 5,
    marginLeft: 10
  },
  rightIcon: {
    marginRight: 20,
    color: Color.white
  },
  rightlastIcon: {
    marginRight: 30,
    color: Color.white, 
  },
  rightlastText: {
    marginRight: 20,
    color: Color.white
  }
});
