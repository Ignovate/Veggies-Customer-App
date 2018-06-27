import React from "react";
import { View, Text, TouchableOpacity, Image, FlatList, ScrollView, StyleSheet, Platform } from "react-native";
import Base from "../base";
import Style from "./OrderDetailsStyle";
import { Color } from "../../styles/Color";
import LinearGradient from "react-native-linear-gradient";
import SplashScreen from "react-native-splash-screen";
import { Card } from "react-native-elements";
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import Dash from 'react-native-dash';
import Service from "../../routes/service";
import SideMenu from "../sideMenu/SideMenu";
import Accordion from 'react-native-collapsible/Accordion';
import IconAwesome from "react-native-vector-icons/FontAwesome";

let instance;

export default class OrderDetails extends Base {

    componentDidMount() {
        SideMenu.fetchDetails();
        this.setState({ data: this.props.navigation.state.params.data });
        section = Array(this.props.navigation.state.params.data);
        this.setState({ section: section });
    }

    constructor() {
        super();
        instance = this;
        this._showProgress = this._showProgress.bind(this);
        this._hideProgress = this._hideProgress.bind(this);
        this._getCategorySuccess = this._getCategorySuccess.bind(this);
        this._onFailure = this._onFailure.bind(this);
        this.state = {
            data: { customer: {}, items: [], billing: {}, shipping: {}, shipping_method: {}, payment_method: {}, payment: {} },
            section: [],
            activeSection: false
        };
    }

    _setSection(section) {
        this.setState({ activeSection: section });
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

    _getCategorySuccess(responseData) {
        this.setState({ data: responseData });
        section = Array(responseData);
        this.setState({ section: section });
    }

    _onFailure() { }

    renderPrice = (price) => {
        var num = Number(price) // The Number() only visualizes the type and is not needed
        var roundedString = num.toFixed(2);
        if (roundedString == "NaN") {
            roundedString = "0.00"
        }
        return (
            <Text style={[Style.productItemText, { alignSelf: "flex-end"}]}>Rs. {roundedString}</Text>
        );
    }

    renderPriceWithDel = (price, dev) => {
        var num = Number(price) // The Number() only visualizes the type and is not needed
        var del = Number(dev)
        var total = num - del;
        var roundedString = total.toFixed(2);

        return (
            <Text style={[Style.productItemText, { fontWeight: "bold", alignSelf: "flex-end"}]}>Rs. {roundedString}</Text>
        );
    }

    _renderHeader(section, i, isActive) {
        return (
            <View>
                <View style={{ flexDirection: "row" }}>
                    <Text style={[Style.address, { marginTop: 0 }]}>Order Details</Text>
                    <IconAwesome
                        size={25}
                        color={Color.darkgree}
                        name={!isActive ? "plus-circle" : "minus-circle"}
                        style={{ right: 0, position: "absolute" }}
                    />
                </View>

                {!isActive ?
                    <View style={{ flexDirection: "row", marginTop: 10 }}>

                        <View style={{ flex: 1 }}>
                            <Text style={[Style.addtext, { alignSelf: "flex-start", marginTop: 0 }]}>To Pay</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            {(section != undefined && section.grand_total != undefined) ?
                                instance.renderPrice(section.grand_total)
                                : null}
                        </View>
                    </View>
                    : null}
            </View>
        );
    }

    _renderContent(section) {
        return (
            <View >
                <View style={{
                    width: "100%",
                    flexDirection: "row",
                    marginBottom: 10, marginTop: 10
                }}>
                    <View style={{
                        width: "100%",
                        flexDirection: "row"
                    }}>
                        <View style={{ flex: 1 }}>
                            <Text style={[Style.productHeading, { alignSelf: "flex-start"}]}>Products</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[Style.productHeading]} > Units</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[Style.productHeading, { alignSelf: "flex-end"}]}>Price</Text>
                        </View>
                    </View>
                </View>
                <FlatList
                    data={section.items}
                    renderItem={({ item }) => (

                        <View style={{
                            width: "100%",
                            flexDirection: "row"
                        }}>
                            <View style={{ flex: 1 }}>
                                <Text style={[Style.productItemText, { alignSelf: "flex-start"}]}>{item.product_name}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[Style.productItemText]}>{item.qty} kg</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                {instance.renderPrice(item.price)}
                            </View>
                        </View>
                    )}
                    keyExtractor={item => item.product_id}
                />

                <Dash style={{ width: "100%", height: 1, marginTop: 10, marginBottom: 10 }} />

                <View style={{ flexDirection: "row" }}>
                    
                    <View style={{ flex: 1 }}>
                        <Text style={[Style.productItemText, { alignSelf: "flex-end" }]}>Item Total</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        {instance.renderPriceWithDel(section.grand_total, section.shipping_method.value)}
                    </View>
                </View>
                <View style={{ flexDirection: "row" }}>

                    <View style={{ flex: 1}}>
                        <Text style={[Style.productItemText, {alignSelf: "flex-end" }]}>Tax</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        {instance.renderPrice(section.tax_amount)}
                    </View>
                </View>
                <View style={{ flexDirection: "row" }}>

                    <View style={{ flex: 1 }}>
                        <Text style={[Style.productItemText, { alignSelf: "flex-end" }]}>Delivery Charge</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        {instance.renderPrice(section.shipping_method.value)}
                    </View>
                </View>
                <Dash style={{ width: "100%", height: 1, marginBottom: 5, marginTop: 5 }} />
                <View style={{ flexDirection: "row" }}>

                    <View style={{ flex: 1 }}>
                        <Text style={[Style.productItemText, { alignSelf: "flex-end", fontWeight: "bold" }]}>Grand Total </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        {instance.renderPrice(section.grand_total)}
                    </View>
                </View>
                {/* <View style={{ flexDirection: "row" }}>
                            <Text style={[Style.productItemText, { marginLeft: "45%", fontSize: 16 }]}>You Saved</Text>
                            {this.renderPrice(this.state.data.payment.amount_ordered)}
                        </View> */}
            </View>
        );
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
                <ScrollView style={{ marginBottom: 10 }}>

                    {/* <Card containerStyle={Style.categoryCard}>
                    <View style={Style.hor}>
                                <View style={{ flex: 1, justifyContent: "center" }}>
                                    <Text style={[Style.name, { alignSelf: "flex-start" }]}>Order Id</Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: "center" }}>
                                    <Text style={Style.name}> : </Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: "center" }}>
                                    <Text style={[Style.name, { alignSelf: "flex-start", fontWeight: "normal" }]}>{this.state.data.order_number}</Text>
                                </View>
                            </View>
                    </Card> */}

                    <Card containerStyle={Style.categoryCard}>
                        <View style={Style.hor}>
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <Text style={[Style.name, { alignSelf: "flex-start" }]}>Order Status</Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <Text style={Style.name}> : </Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <Text style={[Style.addtext, { alignSelf: "flex-start", fontWeight: "normal" }]}>{this.state.data.status_label}</Text>
                            </View>
                        </View>
                    </Card>
                    <Card containerStyle={Style.categoryCard}>
                        <Text style={Style.address}>Shipping Address</Text>
                        {/* <Text style={Style.addtext}>{this.state.data.shipping.street}</Text> */}
                        <Text style={Style.addtext}>{this.state.data.shipping.street}</Text>
                        <Text style={Style.addtext}>{this.state.data.shipping.city} {this.state.data.shipping.region} {this.state.data.shipping.postcode}</Text>

                    </Card>

                    <Card containerStyle={Style.itemCard}>
                        <Accordion
                            // activeSection={this.state.activeSection}
                            sections={this.state.section}
                            renderHeader={this._renderHeader}
                            renderContent={this._renderContent}
                        />

                    </Card>
                    <Card containerStyle={Style.categoryCard}>
                        <Text style={Style.address}>Mode of Delivery</Text>
                        <Text style={Style.addtext}>{this.state.data.shipping_method.label}</Text>

                        {/* <View style={Style.hor}>
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <Text style={[Style.name, { alignSelf: "flex-start", fontSize: 14 }]}>Mode of Delivery</Text>
                            </View>c
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <Text style={Style.name}> : </Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <Text style={[Style.name, { alignSelf: "flex-start", fontWeight: "normal", fontSize: 14 }]}>{this.state.data.shipping_method.label}</Text>
                            </View>
                        </View> */}
                    </Card>

                    <Card containerStyle={Style.categoryCard}>
                        <Text style={Style.address}>Mode of Payment</Text>
                        <Text style={Style.addtext}>{this.state.data.payment_method.label}</Text>
                        {/* <View style={Style.hor}>
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <Text style={[Style.name, { alignSelf: "flex-start", fontSize: 14 }]}>Mode of Payment</Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <Text style={Style.name}> : </Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <Text style={[Style.name, { alignSelf: "flex-start", fontWeight: "normal", fontSize: 14 }]}>{this.state.data.payment_method.label}</Text>
                            </View>
                        </View> */}
                    </Card>

                </ScrollView>
                {this.state.progrstatus ? <Base /> : null}
            </View >
        );
    }
}
