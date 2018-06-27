import React from "react";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Color from "../styles/Color";
import PropTypes from "prop-types";

const DrawerButton = ({ navigation }) => (
  <TouchableOpacity
    style={{ marginLeft: 10 }}
    onPress={() => navigation.navigate("DrawerOpen")}
  >
    <Icon name="menu" size={40} color="white" />
  </TouchableOpacity>
);

DrawerButton.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default DrawerButton;
