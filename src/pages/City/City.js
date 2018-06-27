import React, { Component } from "react";
import { Card, CheckBox } from "react-native-elements";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, NetInfo, FlatList } from "react-native";
import Base from "../base";
import SplashScreen from "react-native-splash-screen";
import Style from "../Verification/Verification.Style";
import { Dropdown } from 'react-native-material-dropdown';
import { Color } from "../../styles/Color";
import LinearGradient from "react-native-linear-gradient";
import Service from "../../routes/service";
import { Constants } from "../../utils/constants";
import SInfo from "react-native-sensitive-info";
import IconAwesome from "react-native-vector-icons/FontAwesome";

export default class City extends Base {

    componentWillMount() {
        SplashScreen.hide();
    }

    constructor() {
        super();
        this._showProgress = this._showProgress.bind(this);
        this._hideProgress = this._hideProgress.bind(this);
        this._onFailure = this._onFailure.bind(this);
        this._onSuccessCityCall = this._onSuccessCityCall.bind(this);
        this._onSuccessAreaCall = this._onSuccessAreaCall.bind(this);
        this._onSuccessAddress = this._onSuccessAddress.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onAreaSelect = this.onAreaSelect.bind(this);
        this.onSubmitBtn = this.onSubmitBtn.bind(this);
        this.callBackAddress = this.callBackAddress.bind(this);
        this._onSuccessConfig = this._onSuccessConfig.bind(this);
        this.setState({
            cityData: [],
            areaData: [],
        });
    }

    componentDidMount() {

        // NetInfo.getConnectionInfo().then((connectionInfo) => {
        //     if (connectionInfo.type == "none" || connectionInfo.type == "unknown") {
        //         this._showAlert("No internet access. Please connect to internet", "OK")
        //     }
        // });
        this.callBackAddress();
    }

    _onSuccessAddress(responseDate) {

        this.setState({
            flag: true,
            listData: responseDate
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

    _onFailure() { }

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

    onChangeText(value, index, data) {
        this.setState({ selectedCity: value, [this.state.prev]: false, address: undefined });
        SInfo.setItem("address", "", {});
        SInfo.setItem("city", value, {});
        var str = data[index].code
        SInfo.setItem("region_id", str.substr(1), {});
        Service.getInstance()._getAreaById(data[index].id, this, this._onSuccessAreaCall, this._onFailure);
    }

    onAreaSelect(value, index, data) {
        this.setState({ selectedArea: value, [this.state.prev]: false, address: undefined });
        SInfo.setItem("address", "", {});
        SInfo.setItem("area", value, {});
        SInfo.setItem("storeId", data[index].id, {});
    }

    onSubmitBtn() {
        Service.getInstance()._getConfig(this, this._onSuccessConfig, this._onFailure);
    }

    _onSuccessConfig(responseDate) {
        if (this.state.selectedArea == undefined && this.state.selectedArea == undefined && this.state.address == undefined) {
            this._showAlert("Please select your preference", "OK");
        } else {
            if (responseDate != undefined) {
                if (responseDate.quote_id != null && responseDate.quote_id != "" && responseDate.quote_id != undefined) {
                    SInfo.setItem("quote_id", responseDate.quote_id, {});
                } else {
                    SInfo.setItem("quote_id", "", {});
                }
            }
            this._moveToHomePage();
        }
    }

    callBackAddress() {
        Service.getInstance()._getCity(this, this._onSuccessCityCall, this._onFailure);

        Service.getInstance()._getAddress(this, this._onSuccessAddress, this._onFailure);
    }


    render() {
        const { navigate } = this.props.navigation;

        return (
            <View style={styles.root}>
                <Image
                    style={styles.bg}
                    source={require("../../../assets/cover.png")}
                    resizeMode="stretch"
                />

                <View style={{ padding: 15 }}>
                    <Text style={[styles.otpText, { marginTop: 20 }]}>Please select your preference</Text>

                    <FlatList style={{ marginBottom: 20 }}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={true}
                        removeClippedSubviews={false}
                        extraData={this.state}
                        data={this.state.listData}
                        renderItem={({ item }) => (
                            <Card containerStyle={[styles.categoryCard, { backgroundColor: this.state[item.entity_id] ? "lightgray" : "white" }]}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            [this.state.prev]: false,
                                            [item.entity_id]: true,
                                            prev: item.entity_id,
                                            address: item,
                                            selectedArea: undefined,
                                            selectedCity: undefined
                                        })

                                        SInfo.setItem("address", JSON.stringify(item), {});
                                        SInfo.setItem("city", "", {});
                                        SInfo.setItem("area", "", {});
                                        SInfo.setItem("storeId", item.city_id, {});
                                    }}
                                >
                                    <View style={{ marginRight: 30 }}>
                                        <Text style={styles.addtext}>{item.door_no} {item.street_name} {item.city},</Text>
                                        <Text style={styles.addtext}>{item.city} {item.region} - {item.postcode}</Text>
                                    </View>
                                    <IconAwesome
                                        size={20}
                                        color={Color.darkgree}
                                        name="edit"
                                        style={{ position: "absolute", right: 0, top: 0 }}
                                        onPress={() => navigate("NewAddress", { callBack: this.callBackAddress, flag: true, address: item })}
                                    />

                                </TouchableOpacity>
                            </Card>

                        )}
                        keyExtractor={item => item.entity_id}
                    />

                    {/* <Text style={[styles.otpText]}>---------- OR ----------</Text> */}

                    <View style={{
                        flexDirection: "row",
                        paddingLeft: 20,
                        paddingRight: 20,
                        marginTop: -20
                    }}>
                        <Dropdown
                            containerStyle={{ flex: 1, marginRight: 3 }}
                            label='City'
                            onChangeText={this.onChangeText}
                            data={this.state.cityData}
                            textColor="#036937"
                            baseColor="#036937"
                        />
                        <Dropdown
                            containerStyle={{ flex: 1, marginLeft: 3 }}
                            label='Area'
                            onChangeText={this.onAreaSelect}
                            data={this.state.areaData}
                            textColor="#036937"
                            baseColor="#036937"
                        />
                    </View>
                </View>

                <TouchableOpacity onPress={this.onSubmitBtn}>
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
                            height: 40,
                            alignItems: "center",
                            justifyContent: "center",
                            width: "80%",
                            alignSelf: "center",
                        }}
                    >
                        {this.state.flag ?
                            <Text style={Style.submit}>Submit</Text>
                            : <Text style={Style.submit}>Proceed</Text>}
                    </LinearGradient>
                </TouchableOpacity>

            </View >
        );
    }
}

const styles = StyleSheet.create({
    root: { backgroundColor: "white", flex: 1, justifyContent: "center" },
    bg: {
        position: "absolute",
        width: "100%",
        height: "100%",
        opacity: 0.70,
    },
    Dropdown: {
        backgroundColor: Color.white
    },
    otpText: {
        alignSelf: "center",
        textAlign: 'center',
        backgroundColor: "transparent",
        fontSize: 20,
        paddingLeft: 25,
        paddingRight: 25,
        fontWeight: "bold",
        color: Color.darkgree
    },
    categoryCard: {
        borderRadius: 5,
        flex: 20
    },
    addtext: {
        marginTop: 5,
        color: Color.darkgree,
        fontSize: 12,
    },
});