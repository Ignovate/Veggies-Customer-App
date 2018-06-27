import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import Base from "../base";
import RadioButton from "react-native-radio-button";
import Style from "./ChangeAddressStyle";
import { Color } from "../../styles/Color";
import LinearGradient from "react-native-linear-gradient";
import FAB from "react-native-fab";
import Icon from "react-native-vector-icons/MaterialIcons";

export default class ChangeAddress extends Base {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={Style.root}>
        <View style={Style.bottomLayer}>
          <View style={Style.radioContainer}>
            <View style={Style.radioStyle}>
              <RadioButton
                animation={"bounceIn"}
                isSelected={true}
                //   onPress={() => doSomething("hello")}
                innerColor={Color.green}
                outerColor={Color.black}
              />
            </View>
            <View style={Style.editContainer}>
              <Text style={Style.titleText}>Home(Default)</Text>
              <TouchableOpacity onPress={() => navigate("ChangeAddress")}>
                <Image
                  style={Style.editIcon}
                  source={require("../../../assets/icon-edit.png")}
                  onPress={() => navigate("ChangeAddress")}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={Style.bottomLayer}>
          <View style={Style.radioContainer}>
            <View style={Style.radioStyle}>
              <RadioButton
                animation={"bounceIn"}
                isSelected={false}
                //   onPress={() => doSomething("hello")}
                innerColor={Color.gray}
                outerColor={Color.black}
              />
            </View>
            <View style={Style.editContainer}>
              <Text style={Style.titleText}>Adddress 1</Text>
              <TouchableOpacity onPress={() => navigate("ChangeAddress")}>
                <Image
                  style={Style.editIcon}
                  source={require("../../../assets/icon-edit.png")}
                  onPress={() => navigate("ChangeAddress")}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <FAB
          buttonColor="red"
          iconTextColor="#FFFFFF"
          onClickAction={() => {
            navigate("NewAddress");
          }}
          visible={true}
          iconTextComponent={<Icon name="all-out" />}
        />
      </View>
    );
  }
}
