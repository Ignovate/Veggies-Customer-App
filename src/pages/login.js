import React from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, KeyboardAvoidingView } from "react-native";
import SInfo from "react-native-sensitive-info";
import SplashScreen from "react-native-splash-screen";
import ServiceCall from "../routes/service";
import { Constants } from "../utils/constants";
import Base from "./base";
const FBSDK = require("react-native-fbsdk");
const { LoginManager, GraphRequest, GraphRequestManager } = FBSDK;
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import FCM, { NotificationActionType } from "react-native-fcm";

var instance;
export default class Login extends Base {
    static instance;

    async componentDidMount() {
        SplashScreen.hide();

        super._permissions();
        // this.setState({
        //     name: "Ravikumar",
        //     phoneNumber: "8610816808"
        // })
    }

    constructor() {
        super();
        this._showProgress = this._showProgress.bind(this);
        this._hideProgress = this._hideProgress.bind(this);
        this._registrationSuccess = this._registrationSuccess.bind(this);
        this._onFailure = this._onFailure.bind(this);
        this._callRegister = this._callRegister.bind(this);
        this._sendVerify = this._sendVerify.bind(this);
        this._sendOTPSuccess = this._sendOTPSuccess.bind(this);
        this._sendOTPFailure = this._sendOTPFailure.bind(this);
        instance = this;
    }

    async googleAuth() {
        GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
            GoogleSignin.configure({
                iosClientId: "387192146337-mnlvtebab9jfqton1kmpq4v1q57qtvc7.apps.googleusercontent.com",
            })
                .then(() => {
                    GoogleSignin.signIn()
                        .then((user) => {
                            SInfo.setItem("name", user.name == undefined ? "": user.name, {});
                            SInfo.setItem("photo", user.photo == undefined ? "": user.photo, {});
                            this._showProgress();
                            instance._callRegister(user.email, "google", user.name);
                        })
                        .catch((err) => {
                            alert("Login fail with error: " + err);
                        })
                        .done();
                });
        })
            .catch((err) => {
                alert("Play services error", err.code, err.message);
            })
    }

    fbAuth() {
        LoginManager.logInWithReadPermissions(["public_profile", "email"]).then(
            function (result) {
                if (result.isCancelled) {

                } else {
                    if (result.declinedPermissions.length == 0) {
                        instance.fetchEmail();
                    } else {
                        this._showAlert(
                            "Email is mandatory for login. Please grand the permission or use manual signup."
                        );
                    }

                }
            },
            function (error) {
                alert("Login fail with error: " + error);
            }
        );
    }

    fetchEmail() {
        this._showProgress();
        const infoRequest = new GraphRequest(
            "/me?fields=id,first_name,last_name,picture,email",
            null,
            this._responseInfoCallback
        );

        new GraphRequestManager().addRequest(infoRequest).start();
    }


    _responseInfoCallback(error, result) {
        if (error) {
            alert("Error fetching data: " + error.toString());
        } else {
            name = result.first_name;
            SInfo.setItem("name", name == undefined ? "": name, {});
            SInfo.setItem("photo", result.picture.data.url == undefined ? "": result.picture.data.url, {});
            if (result.email != undefined)
                instance._callRegister(result.email, "facebook", name);
            else
                instance._callRegister(result.id, "facebook", name);
        }
    }

    _registrationSuccess(responseData) {
        //{"messages":{"error":[{"code":200,"message":"Invalid email address \"\"."},{"code":200,"message":"The password cannot be empty."},{"code":200,"message":"Customer data is invalid"}]}}
        if (responseData.messages != undefined) {
            this._showAlert(responseData.messages.error[0].message, "Ok");
        } else {
            SInfo.setItem("storeId", "19", {});
            SInfo.setItem("token_id", responseData.token_id, {});
            SInfo.setItem("customer_id", responseData.customer_id, {});
            SInfo.setItem("token", responseData.token, {});
            SInfo.setItem("secret", responseData.secret, {});
            SInfo.setItem("phone", this.state.phoneNumber == undefined ? "" : this.state.phoneNumber, {});
            this._moveToHomePage();
        }
    }

    _onFailure() {
        SInfo.setItem("name", "", {});
        SInfo.setItem("photo", "", {});
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

    _callRegister(email, source, name) {
        FCM.getFCMToken().then(token => {
            var userInfo = JSON.stringify({
                api_key: Constants.CONSUMER_KEY_TEMP,
                key: email,
                source: source,
                name: name,
                fcm_id: token
            });

            ServiceCall.getInstance()._userRegister(
                userInfo,
                this,
                this._registrationSuccess,
                this._onFailure
            );
            // } else {
            //    this._showAlert("Try again", "ok");
        });
    }


    _sendVerify() {
        if (this.state.name == undefined || this.state.phoneNumber == undefined) {
            this._showAlert("Please enter a name and mobile", "OK");
        } else {
            ServiceCall.getInstance().sendOTP(
                this.state.phoneNumber,
                this,
                this._sendOTPSuccess,
                this._sendOTPFailure
            );

        }
    }

    _sendOTPSuccess(responseData) {
        if (responseData.Status.toUpperCase() == "SUCCESS") {
            this.props.navigation.navigate("Verification", { name: this.state.name, phone: this.state.phoneNumber, session: responseData.Details })
        } else if (responseData.Status.toUpperCase() == "ERROR") {
            this._showAlert(responseData.Details, "OK");
        }
    }

    _sendOTPFailure() {
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.root}>
                <Image
                    style={styles.bg}
                    source={require("../../assets/cover.png")}
                    resizeMode="stretch"
                />
                <View style={{alignContent: "center"}}>
                    <Image
                        style={styles.image1}
                        source={require("../../assets/icon.png")}
                        resizeMode="stretch"
                    />
                    <KeyboardAvoidingView
                        behavior="padding"
                    >
                        <TextInput
                            underlineColorAndroid="transparent"
                            placeholder="Enter Your Name"
                            style={styles.textInput1}
                            onChangeText={text => this.setState({ name: text })}
                            returnKeyType="done"
                            maxLength={25}
                        >{this.state.name}</TextInput>
                        <TextInput
                            underlineColorAndroid="transparent"
                            placeholder="Mobile Number"
                            keyboardType="numeric"
                            style={styles.textInput1}
                            onChangeText={text => this.setState({ phoneNumber: text })}
                            returnKeyType="done"
                            maxLength={10}
                        >{this.state.phoneNumber}</TextInput>
                    </KeyboardAvoidingView>

                    <View style={styles.rect1} />

                    <TouchableOpacity
                        style={styles.button2}
                        onPress={this._sendVerify}
                    >
                        <Text style={styles.text3}>Get OTP</Text>
                    </TouchableOpacity>

                    <View style={styles.rect2} />

                    <TouchableOpacity
                        style={styles.button3}
                        onPress={this.googleAuth.bind(this)}
                    >
                        <Text style={styles.text3}>Gmail</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button4}
                        onPress={this.fbAuth.bind(this)}
                    >
                        <Text style={styles.text3}>Facebook</Text>
                    </TouchableOpacity>
                </View>

                {this.state.progrstatus ? <Base /> : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: { backgroundColor: "white", flex: 1, justifyContent: "center" },
    bg: {
        position: "absolute",
        width: "100%",
        height: "100%",
        opacity: 0.7
    },
    image1: {
        width: 180,
        height: 170,
        alignSelf: "center",
        marginBottom: 15
    },
    textInput1: {
        alignSelf: "center",
        width: "60%",
        height: 35,
        fontSize: 15,
        marginBottom: "2%",
        backgroundColor: "white",
        paddingLeft: "5%",
        borderRadius: 3,
    },
    rect1: {
        marginTop: "3%",
        marginBottom: "5%",
        alignSelf: "center",
        width: "60%",
        height: 1,
        position: "relative",
        backgroundColor: "transparent",
        opacity: 0.65,
        borderWidth: 1,
        borderColor: "white"
    },
    rect2: {
        marginTop: "5%",
        marginBottom: "5%",
        alignSelf: "center",
        width: "60%",
        height: 1,
        position: "relative",
        backgroundColor: "transparent",
        opacity: 0.65,
        borderWidth: 1,
        borderColor: "rgba(74,74,74,1)"
    },
    text3: {
        backgroundColor: "transparent",
        fontSize: 14,
        color: "rgba(255,255,255,1)"
    },

    button2: {
        width: "60%",
        height: 40,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        backgroundColor: "#036937",
        borderRadius: 3,
        marginBottom: "3%"
    },
    button3: {
        width: "60%",
        height: 40,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        backgroundColor: "rgba(223,81,69,1)",
        borderRadius: 3,
        marginBottom: "3%"
    },
    button4: {
        width: "60%",
        height: 40,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        backgroundColor: "rgba(82,133,198,1)",
        borderRadius: 3,
        marginBottom: "3%"
    }
});
