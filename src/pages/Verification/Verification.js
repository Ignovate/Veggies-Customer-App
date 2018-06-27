import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, } from "react-native";
import Base from "../base";
import Style from "./Verification.Style";
import CodeInput from "react-native-confirmation-code-input";
import { Color } from "../../styles/Color";
import ServiceCall from "../../routes/service";
import { Constants } from "../../utils/constants";
import SInfo from "react-native-sensitive-info";
import FCM, { NotificationActionType } from "react-native-fcm";
import SmsListener from 'react-native-android-sms-listener'

export default class Verification extends Base {

  constructor() {
    super();
    this._showProgress = this._showProgress.bind(this);
    this._hideProgress = this._hideProgress.bind(this);
    this._sendOTPSuccess = this._sendOTPSuccess.bind(this);
    this._sendOTPFailure = this._sendOTPFailure.bind(this);
    this._verifyOTPSuccess = this._verifyOTPSuccess.bind(this);
    this._registrationSuccess = this._registrationSuccess.bind(this);
    this._onFailure = this._onFailure.bind(this);
    this._onFulfill = this._onFulfill.bind(this);
    this.state = {
      progrstatus: false
    }
  }

  componentDidMount() {
    this.setState({ name: this.props.navigation.state.params.name });
    this.setState({ phone: this.props.navigation.state.params.phone });
    this.setState({ session: this.props.navigation.state.params.session });

    mySubScription = SmsListener.addListener(message => {
      // /Your password to Freshness is [\d]{6}. Use this as your OTP to gain access to Abundance of Freshness./
      let verificationCodeRegex = /[\d]{6}/;
      if (message.originatingAddress.substring(3) == "VEGGIE") {
        if (verificationCodeRegex.test(message.body)) {
          let verificationCode = message.body.match(verificationCodeRegex)[0];
          this.setState({
            code: verificationCode,
            code1: "*"
          });

          this._onFulfill(verificationCode);
        }
      }
    });
  }

  _showProgress() {
    this.setState({
      progrstatus: true
    });
  }

  _hideProgress() {
    this.setState({
      progrstatus: false
    });
  }

  _sendSms() {
    if (this.state.phone == "") {
      this._showAlert("Please enter Phone Number", "OK");
      return;
    }

    ServiceCall.getInstance().sendOTP(
      this.state.phone,
      this,
      this._sendOTPSuccess,
      this._sendOTPFailure
    );
  }

  _onFulfill(code) {
    code: this.state.code;
    ServiceCall.getInstance().verifyOTP(
      code,
      this.state.session,
      this,
      this._verifyOTPSuccess,
      this._sendOTPFailure
    );
  }

  _sendOTPSuccess(responseData) {
    if (responseData.Status.toUpperCase() == "SUCCESS") {
      this.setState({ session: responseData.Details });
    } else if (responseData.Status.toUpperCase() == "ERROR") {
      this._showAlert(responseData.Details, "OK");
    }
  }

  _sendOTPFailure() {

  }

  _verifyOTPSuccess(responseData) {
    SInfo.setItem("phone", this.state.phone, {});
    SInfo.setItem("name", this.state.name, {});
    if (responseData.Status.toUpperCase() == "SUCCESS") {
      this.state.session = responseData.Details;

      FCM.getFCMToken().then(token => {
        var userInfo = JSON.stringify({
          api_key: Constants.CONSUMER_KEY_TEMP,
          key: this.state.phone,
          source: "direct",
          name: this.state.name,
          fcm_id: token
        });

        ServiceCall.getInstance()._userRegister(
          userInfo,
          this,
          this._registrationSuccess,
          this._onFailure
        );
      });
    } else {
      this.setState({
        code1: "*"
      });
      this.refs.refName.clear();
      this._showAlert(responseData.Details, "OK");
    }
  }

  _registrationSuccess(responseData) {
    SInfo.setItem("storeId", "19", {});
    SInfo.setItem("name", this.state.name, {});
    SInfo.setItem("token_id", responseData.token_id, {});
    SInfo.setItem("customer_id", responseData.customer_id, {});
    SInfo.setItem("token", responseData.token, {});
    SInfo.setItem("secret", responseData.secret, {});
    // const { navigate } = this.props.navigation;
    // navigate("city");
    this._moveToHomePage();
  }

  _onFailure() { }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={Style.root}>
        <Image
          style={Style.bg1}
          source={require("../../../assets/cover.png")}
          resizeMode="stretch"
        />
        <View>
          <Text style={Style.otpText}>Enter OTP</Text>

          <View style={Style.codeInput}>
            <CodeInput
              ref="refName"
              autoFocus={false}
              activeColor={Color.black}
              inactiveColor={Color.gray}
              keyboardType="numeric"
              className={"border-b"}
              space={8}
              size={20}
              codeLength={6}
              code={this.state.code}
              onFulfill={(code) => this._onFulfill(code)}
            >
              {this.state.code1}
            </CodeInput>
          </View>

          <Text style={Style.resendText} onPress={this._sendSms.bind(this)}>Resend Code</Text>

          {/* <TouchableOpacity
            style={Style.button2}
            onPress={this._verify.bind(this)}
          >
            <Text style={Style.submit}>Submit</Text>
          </TouchableOpacity> */}
        </View>
        {this.state.progrstatus ? <Base /> : null}
      </View>
    );
  }
}
