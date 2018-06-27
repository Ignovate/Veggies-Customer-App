import { StyleSheet } from "react-native";
import { Color } from "../../styles/Color";

export default {
  root: {
    flex: 1
  },
  bottomLayer: {
    width: "95%",
    height: "20%",
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: Color.yellow,
    margin: 10
  },
  radioContainer: {
    flexDirection: "row"
  },
  editContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginLeft: 20,
    width: "80%"
  },
  titleText: {
    color: Color.Black,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10
  },
  editIcon: {
    width: 20,
    height: 20
  },
  radioStyle: {
    marginTop: 50,
    marginLeft: 20
  },
  placeOrderText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold"
  }
};
