import React from "react";
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView , Platform} from "react-native";
import Base from "../base";
import RadioButton from "react-native-radio-button";
import Style from "./NewAddressStyle";
import { Color } from "../../styles/Color";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Card, CheckBox } from "react-native-elements";
import SInfo from "react-native-sensitive-info";
import SplashScreen from "react-native-splash-screen";
import Service from "../../routes/service";
import { Constants } from "../../utils/constants";
import { Dropdown } from 'react-native-material-dropdown';
import SideMenu from "../sideMenu/SideMenu";

export default class ChangeAddress extends Base {
  static instance;
  constructor() {
    super();
    instance = this;
    this.onSubmitBtn = this.onSubmitBtn.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onFailure = this.onFailure.bind(this);
    this.onBackMove = this.onBackMove.bind(this);
    this._showProgress = this._showProgress.bind(this);
    this._hideProgress = this._hideProgress.bind(this);
    this._onSuccessCityCall = this._onSuccessCityCall.bind(this);
    this._onSuccessAreaCall = this._onSuccessAreaCall.bind(this);
    this.setState({
      address: { billing_address: {}, comment: {} }
    });
  }

  componentWillMount() {
    this.setState({
      flag: this.props.navigation.state.params.flag,
      checked: false
    });

    this.callBackAddress();

    if (this.props.navigation.state.params.address != undefined && this.props.navigation.state.params.address != "") {
      var values = this.props.navigation.state.params.address;
      this.setState({
        address: values,
        firstName: values.firstname,
        lastName: values.lastname,
        door_no: values.door_no,
        apt_name: values.apt_name,
        street_name: values.street_name,
        landmark: values.landmark,
        areaTxt: values.city,
        cityTxt: values.region,
        city_id: values.city_id,
        postcode: values.postcode,
        notes: values.customer_note,
        cus_email: values.cus_email,
        telephone: values.telephone,
        customer_address_id: values.customer_address_id
      });
    } else {

      // this.setState({
      //   firstName: "Ravikumar",
      //   lastName: "S",
      //   door_no: "4",
      //   apt_name: "A-block",
      //   street_name: "Perur main road",
      //   landmark: "kovaipudur",
      //   // areaTxt: "Myl",
      //   // cityTxt: "Chennai",
      //   // city_id: value.city_id,
      //   postcode: "610020",
      //   notes: "Test",
      //   cus_email: "ravikumar@gmail.com",
      //   telephone: "9944415541"
      // });

      SInfo.getItem("phone", {}).then(value => {
        if (value != "" && value != undefined && value != null)
          this.setState({
            telephone: value
          });
      });

      // SInfo.getItem("area", {}).then(value => {
      //   this.setState({
      //     areaTxt: value
      //   });
      // });

      // SInfo.getItem("city", {}).then(value => {
      //   this.setState({
      //     cityTxt: value
      //   });
      // });
    }
  }

  componentDidMount() {
    SideMenu.fetchDetails();
    // SInfo.getItem("region_id", {}).then(value => {
    //   this.setState({
    //     region_id: value
    //   })
    // });
    // SInfo.getItem("storeId", {}).then(value => {
    //   this.setState({
    //     city_id: value
    //   })
    // });
  }

  _showProgress() {
    this.setState({
      progrstatus: true,
    });
  }

  _hideProgress() {
    this.setState({
      progrstatus: false
    });
  }

  callBackAddress() {
    Service.getInstance()._getCity(this, this._onSuccessCityCall, this.onFailure);
  }

  onChangeText(value, index, data) {
    var str = data[index].code
    instance.setState({ cityTxt: value, region_id: str.substr(1) });
    Service.getInstance()._getAreaById(data[index].id, instance, instance._onSuccessAreaCall, instance._onFailure);
  }

  onAreaSelect(value, index, data) {
    instance.setState({
      areaTxt: value,
      city_id: data[index].id
    });
  }

  _onSuccessAreaCall(responseDate) {
    const data = [];
    responseDate.data.map((userData) => {
      data.push({
        id: userData.id,
        value: userData.name,
        code: userData.code,
        active: userData.active
      });
    });
    this.setState({
      areaData: data
    });
  }

  _onSuccessCityCall(responseDate) {
    const data = [];
    responseDate.data.map((userData) => {
      data.push({
        id: userData.id,
        value: userData.name,
        code: userData.code,
        active: userData.active
      });
    });
    this.setState({
      cityData: data
    });
  }

  onSubmitBtn() {

    if (this.state.areaTxt != undefined && this.state.cityTxt != undefined && this.state.door_no != undefined && this.state.street_name != undefined && this.state.postcode != undefined && this.state.firstName != undefined && this.state.lastName != undefined && this.state.telephone != undefined) {

      // if (!this.state.checked) {
      //   this.onBackMove();
      // } else {
      var jsonReq = JSON.stringify({
        api_key: Constants.CONSUMER_KEY_TEMP,
        firstname: this.state.firstName,
        lastname: this.state.lastName,
        street_name: this.state.street_name,
        door_no: this.state.door_no,
        landmark: this.state.landmark,
        apt_name: this.state.apt_name,
        city: this.state.areaTxt,
        country_id: "IN",
        region: this.state.cityTxt,
        region_id: this.state.region_id,
        postcode: this.state.postcode,
        telephone: this.state.telephone,
        cus_email: this.state.cus_email,
        city_id: this.state.city_id
      });

      if (this.state.flag) {
        Service.getInstance()._updateAddress(this.state.address.entity_id, jsonReq, this, this.onSuccess, this.onFailure);
      } else {
        if (this.state.address != undefined && this.state.address.customer_address_id != undefined) {
          Service.getInstance()._updateAddress(this.state.address.customer_address_id, jsonReq, this, this.onSuccess, this.onFailure);
        } else {
          Service.getInstance()._addAddress(jsonReq, this, this.onSuccess, this.onFailure);
        }
      }
      // }
    } else {
      this._showAlert("Please fill mandatory fields", "OK");
    }
  }

  onSuccess(responseData) {
    // {"messages":{"error":[{"code":0,"message":"Address field missing"}]}}
    if (responseData.messages != undefined) {
      this._showAlert(responseData.messages.error[0].message, "Ok");
    }
    if (responseData.success != undefined)
      this.onBackMove(responseData.success[0].customer_address_id);
  }

  onFailure() { }

  onBackMove(id) {
    var addressLocal = JSON.stringify({
      customer_address_id: id,
      firstname: this.state.firstName,
      lastname: this.state.lastName,
      door_no: this.state.door_no,
      apt_name: this.state.apt_name,
      street_name: this.state.street_name,
      landmark: this.state.landmark,
      city: this.state.areaTxt,
      country_id: "IN",
      region: this.state.cityTxt,
      region_id: this.state.region_id,
      postcode: this.state.postcode,
      telephone: this.state.telephone,
      customer_note: this.state.notes,
      cus_email: this.state.cus_email,
      city_id: this.state.city_id,
      customer_note: this.state.notes
    });

    this.props.navigation.state.params.callBack(JSON.parse(addressLocal));
    this.props.navigation.goBack();
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={Style.root}>
        <Image
          style={Style.bg}
          source={require("../../../assets/cover.png")}
          resizeMode="stretch"
        />
        <LinearGradient
          colors={[
            "#036937",
            "#1F7727",
            "#287B1F",
            "#388317",
            "#468B0E",
            "#539108",
            "#5A9502"
          ]}
          start={{ x: 0.0, y: 1.0 }}
          end={{ x: 1.0, y: 1.0 }}
          style={{
            width: "100%",
            height: Platform.OS === 'ios' ? 64 : 60,
            alignItems: "center",
            justifyContent: "center",
            bottom: 0
          }}
        />
        <ScrollView style={{ marginBottom: 50 }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always" >
          <Card containerStyle={Style.Card}>
            <Text style={Style.heading}>Personal Details</Text>
            <View style={Style.nameContainer}>
              <TextInput
                placeholderTextColor={Color.darkgree}
                underlineColorAndroid={Color.darkgree}
                placeholder="First Name *"
                style={Style.firstName}
                returnKeyType='next'
                onChangeText={text => this.setState({ firstName: text })}
                maxLength={25}
              >
                {this.state.firstName}</TextInput>
              <TextInput
                underlineColorAndroid={Color.darkgree}
                placeholderTextColor={Color.darkgree}
                placeholder="Last Name *"
                style={Style.firstName}
                onChangeText={text => this.setState({ lastName: text })}
                returnKeyType='next'
                maxLength={25}
              >
                {this.state.lastName}</TextInput>
            </View>
            <TextInput
              underlineColorAndroid={Color.darkgree}
              placeholderTextColor={Color.darkgree}
              placeholder="Contact Number *"
              keyboardType="numeric"
              style={Style.contactNo}
              onChangeText={text => this.setState({ telephone: text })}
              returnKeyType='next'
              maxLength={13}
            >
              {this.state.telephone}</TextInput>
            <TextInput
              underlineColorAndroid={Color.darkgree}
              placeholderTextColor={Color.darkgree}
              placeholder="Email"
              style={Style.contactNo}
              onChangeText={text => this.setState({ cus_email: text })}
              returnKeyType='next'
              maxLength={50}
            >
              {this.state.cus_email}</TextInput>
          </Card>
          <Card containerStyle={[Style.Card, { marginBottom: 10 }]}>
            <Text style={Style.heading}>Address Details</Text>
            <View style={Style.nameContainer}>
              <TextInput
                underlineColorAndroid={Color.darkgree}
                placeholderTextColor={Color.darkgree}
                placeholder="House no *"
                style={Style.firstName}
                onChangeText={text => this.setState({ door_no: text })}
                returnKeyType='next'
                maxLength={50}
              >
                {this.state.door_no}</TextInput>
              <TextInput
                underlineColorAndroid={Color.darkgree}
                placeholderTextColor={Color.darkgree}
                placeholder="Apartment Name"
                style={Style.firstName}
                onChangeText={text => this.setState({ apt_name: text })}
                returnKeyType='next'
                maxLength={50}
              >
                {this.state.apt_name}</TextInput>
            </View>
            <TextInput
              underlineColorAndroid={Color.darkgree}
              placeholderTextColor={Color.darkgree}
              placeholder="Street details to locate you  *"
              style={Style.contactNo}
              onChangeText={text => this.setState({ street_name: text })}
              returnKeyType='next'
              maxLength={130}
            >
              {this.state.street_name}</TextInput>
            <TextInput
              underlineColorAndroid={Color.darkgree}
              placeholder="Landmark(Optional)"
              placeholderTextColor={Color.darkgree}
              style={Style.contactNo}
              onChangeText={text => this.setState({ landmark: text })}
              returnKeyType='next'
              maxLength={130}
            >
              {this.state.landmark}</TextInput>

            <View style={[Style.nameContainer, { marginTop: Platform.OS === 'ios' ? 0 : -20 }]}>
              <Dropdown
                containerStyle={{ flex: 1, marginRight: 3 }}
                label='City *'
                value={this.state.cityTxt}
                onChangeText={this.onChangeText}
                data={this.state.cityData}
                textColor="#036937"
                baseColor="#036937"
              />
              <Dropdown
                containerStyle={{ flex: 1, marginLeft: 3 }}
                label='Area *'
                value={this.state.areaTxt}
                onChangeText={this.onAreaSelect}
                data={this.state.areaData}
                textColor="#036937"
                baseColor="#036937"
              />
            </View>
            {/* {!this.state.flag ?
              <View style={[Style.nameContainer, { marginTop: -20 }]}>
                <Dropdown
                  containerStyle={{ flex: 1, marginRight: 3 }}
                  label='City *'
                  value={this.state.cityTxt}
                  onChangeText={this.onChangeText}
                  data={this.state.cityData}
                  textColor="#036937"
                  baseColor="#036937"
                />
                <Dropdown
                  containerStyle={{ flex: 1, marginLeft: 3 }}
                  label='Area *'
                  value={this.state.areaTxt}
                  onChangeText={this.onAreaSelect}
                  data={this.state.areaData}
                  textColor="#036937"
                  baseColor="#036937"
                />
              </View>
              :
              <View style={[Style.nameContainer]}>
                <TextInput
                  editable={false}
                  underlineColorAndroid={Color.darkgree}
                  placeholderTextColor={Color.darkgree}
                  style={Style.firstName}
                  onChangeText={text => this.setState({ area: text })}
                  returnKeyType='next'
                  maxLength={25}
                >
                  {this.state.areaTxt}</TextInput>
                <TextInput
                  editable={false}
                  underlineColorAndroid={Color.darkgree}
                  placeholderTextColor={Color.darkgree}
                  style={Style.firstName}
                  onChangeText={text => this.setState({ city: text })}
                  returnKeyType='next'
                  maxLength={25}
                >
                  {this.state.cityTxt}</TextInput>
              </View>
            } */}

            <TextInput
              underlineColorAndroid={Color.darkgree}
              placeholderTextColor={Color.darkgree}
              placeholder="Pincode *"
              style={Style.contactNo}
              onChangeText={text => this.setState({ postcode: text })}
              returnKeyType='done'
              keyboardType='numeric'
              maxLength={6}
            >
              {this.state.postcode}</TextInput>

            <Text style={{ marginTop: 10, color: Color.darkgree, fontSize: 18}}>Customer Note</Text>

            <TextInput
              underlineColorAndroid={Color.darkgree}
              placeholderTextColor={Color.darkgree}
              placeholder="Notes"
              style={Style.contactNo}
              onChangeText={text => this.setState({ notes: text })}
              returnKeyType="done"
              maxLength={130}
            >
              {this.state.notes}</TextInput>
          </Card>

          {/* <CheckBox
            title='save this address for future shipment'
            checked={this.state.checked}
            containerStyle={{ backgroundColor: "transparent", borderColor: "transparent" }}
            textStyle={{ color: Color.darkgree }}
            onPress={() => this.setState({ checked: !this.state.checked })}
          /> */}

          {/* <Card containerStyle={Style.Card}>
            <Text style={Style.firstName}>Nick Name</Text>

            <View style={Style.nickNameContainer}>
            <TouchableOpacity style={Style.nickButton}>
              <Text style={Style.nickText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={Style.nickButton}>
              <Text style={Style.nickText}>Office </Text>
            </TouchableOpacity>

            <TouchableOpacity style={Style.nickButton}>
              <Text style={Style.nickText}>Other</Text>
            </TouchableOpacity>
          </View>
            <TextInput
              underlineColorAndroid="gray"
              placeholder="Type the nick name for address"
              style={Style.contactNo}
              onChangeText={text => this.setState({ name: text })}
              returnKeyType="done"
              maxLength={12}
            />
            <Text style={Style.heading}>Notification</Text>
            <View style={Style.nameContainer}>
              <RadioButton
                animation={"bounceIn"}
                isSelected={true}
                //   onPress={() => doSomething("hello")}
                innerColor={Color.green}
                outerColor={Color.black}
              />
              <Text style={Style.receiveText}>Receive Notification (SMS)</Text>
            </View>
          </Card> */}
        </ScrollView>

        <TouchableOpacity onPress={this.onSubmitBtn} style={{
          position: "absolute",
          bottom: 0, width: "100%"
        }}>
          <LinearGradient
            colors={[
              "#036937",
              "#1F7727",
              "#287B1F",
              "#388317",
              "#468B0E",
              "#539108",
              "#5A9502"
            ]}
            start={{ x: 0.0, y: 1.0 }}
            end={{ x: 1.0, y: 1.0 }}
            style={{
              width: "100%",
              height: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >

            {this.state.flag ?
              <Text style={Style.placeOrderText}>Update </Text>
              : <Text style={Style.placeOrderText}>Continue </Text>}
          </LinearGradient>
        </TouchableOpacity>

        {this.state.progrstatus ? <Base /> : null}
      </View >
    );
  }
}
