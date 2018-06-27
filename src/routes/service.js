import React, { Component } from "react";
import { Constants } from "../utils/constants";
import SInfo from "react-native-sensitive-info";

export default class Service {
  static instance;

  sendOTP(phonenumber, baseClass, successCallback, errorCallback) {
    this.callAPI(Constants.SMS_URL, 'GET', Constants.SMS_API_KEY + '/SMS/' + phonenumber + '/AUTOGEN/' + Constants.SMS_TEMP, null, successCallback, errorCallback, baseClass);
  }

  verifyOTP(otp, sessionid, baseClass, successCallback, errorCallback) {
    this.callAPI(Constants.SMS_URL, 'GET', Constants.SMS_API_KEY + '/SMS/VERIFY/' + sessionid + '/' + otp, null, successCallback, errorCallback, baseClass);
  }

  _oAuthTemp(baseClass, successCallback, errorCallback) {

    var header = JSON.stringify({
      url: "", oauth: {
        oauth_callback: 'http://melonberries.com/Dev/',
        oauth_consumer_key: Constants.CONSUMER_KEY_TEMP,
        consumer_secret: Constants.CONSUMER_SECRET_TEMP
      }
    });

    this.callAPI(Constants.AUTH_URL,
      "POST",
      Constants.AUTH_TEMP_TOKEN,
      header,
      successCallback,
      errorCallback,
      baseClass);
  }

  _oAuth(baseClass, successCallback, errorCallback) {
    var header = JSON.stringify({
      callback: 'http://melonberries.com/Dev/',
      consumer_key: Constants.CONSUMER_KEY_TEMP,
      consumer_secret: Constants.CONSUMER_SECRET_TEMP,
      token: Constants.CONSUMER_KEY,
      token_secret: Constants.CONSUMER_SECRET,
      verifier: verifier
    });

    this.callAPI(Constants.AUTH_URL,
      "POST",
      Constants.AUTH_TOKEN,
      header,
      successCallback,
      errorCallback,
      baseClass);
  }

  _userRegister(userData, baseClass, successCallback, errorCallback) {
    this.callAPI(Constants.BASE_URL,
      "POST",
      Constants.API_CUSTOMER,
      userData,
      successCallback,
      errorCallback,
      baseClass
    );
  }

  _getCity(baseClass, successCallback, errorCallback) {
    this.callAPI(
      Constants.BASE_URL,
      "GET",
      Constants.API_CITY,
      undefined,
      successCallback,
      errorCallback,
      baseClass
    );
  }

  _getAreaById(id, baseClass, successCallback, errorCallback) {
    this.callAPI(
      Constants.BASE_URL,
      "GET",
      Constants.API_CITY + "/" + id + Constants.API_AREA,
      undefined,
      successCallback,
      errorCallback,
      baseClass
    );
  }

  //http://melonberries.com/Dev/api/rest/v2/homescreen/store/5/limit/5
  _getCategoryLimit(baseClass, successCallback, errorCallback) {
    SInfo.getItem("storeId", {}).then(value => {
      this.callAPI(
        Constants.BASE_URL,
        "GET",
        Constants.API_HOME + Constants.API_STORE + "/" + value + Constants.API_LIMIT + "/5",
        undefined,
        successCallback,
        errorCallback,
        baseClass
      );
    });
  }

  _getCategoryById(id, baseClass, successCallback, errorCallback) {
    SInfo.getItem("customer_id", {}).then(valueCustId => {
      SInfo.getItem("storeId", {}).then(value => {
        if (value != "" && value != "null" && value != null) {
          Constants.LOCATION = value;
          var method = Constants.API_PRODUCTS + Constants.API_CATEGORY + "/" + id + Constants.API_STORE + "/" + value + Constants.API_CUSTOMER + "/" + valueCustId;

          if (id == -1) {
            method = Constants.API_PRODUCTS + Constants.API_STORE + "/" + value + Constants.API_CUSTOMER + "/" + valueCustId;
          }

          this.callAPI(
            Constants.BASE_URL,
            "GET",
            method,
            undefined,
            successCallback,
            errorCallback,
            baseClass
          );
        }
      });
    });
  }

  _getCategories(baseClass, successCallback, errorCallback) {
    this.callAPI(
      Constants.BASE_URL,
      "GET",
      Constants.API_LIST_CATEGORIES,
      undefined,
      successCallback,
      errorCallback,
      baseClass
    );
  }

  _getOrders(baseClass, successCallback, errorCallback) {

    SInfo.getItem("customer_id", {}).then(valueCustId => {
      SInfo.getItem("storeId", {}).then(value => {
        this.callAPI(
          Constants.BASE_URL,
          "GET",
          Constants.API_CUSTOMER + Constants.API_ORDER + "/" + valueCustId + Constants.API_STORE + "/" + value,
          undefined,
          successCallback,
          errorCallback,
          baseClass
        );
      });
    });
  }

  _getOrdersDetails(id, baseClass, successCallback, errorCallback) {

    this.callAPI(
      Constants.BASE_URL,
      "GET",
      Constants.API_ORDER_GET + "/" + id,
      undefined,
      successCallback,
      errorCallback,
      baseClass
    );

  }

  _removeWishlist(id, baseClass, successCallback, errorCallback) {
    SInfo.getItem("customer_id", {}).then(valueCustId => {
      SInfo.getItem("storeId", {}).then(value => {
        this.callAPI(
          Constants.BASE_URL,
          "DELETE",
          Constants.API_WISHLIST + "/" + valueCustId + Constants.API_STORE + "/" + value + Constants.API_PRODUCT + "/" + id,
          undefined,
          successCallback,
          errorCallback,
          baseClass
        );
      });
    });
  }

  _setWishlist(jsonRequest, baseClass, successCallback, errorCallback) {
    SInfo.getItem("customer_id", {}).then(valueCustId => {
      SInfo.getItem("storeId", {}).then(value => {
        this.callAPI(
          Constants.BASE_URL,
          "POST",
          Constants.API_WISHLIST + "/" + valueCustId + Constants.API_STORE + "/" + value,
          jsonRequest,
          successCallback,
          errorCallback,
          baseClass
        );
      });
    });
  }

  _getWishlist(baseClass, successCallback, errorCallback) {
    SInfo.getItem("customer_id", {}).then(valueCustId => {
      SInfo.getItem("storeId", {}).then(value => {
        this.callAPI(
          Constants.BASE_URL,
          "GET",
          Constants.API_WISHLIST + "/" + valueCustId + Constants.API_STORE + "/" + value,
          undefined,
          successCallback,
          errorCallback,
          baseClass
        );
      });
    });
  }

  _addAddress(jsonRequest, baseClass, successCallback, errorCallback) {
    SInfo.getItem("customer_id", {}).then(valueCustId => {
      this.callAPI(
        Constants.BASE_URL,
        "POST",
        Constants.API_CUSTOMER + Constants.API_ADDRESS + "/" + valueCustId,
        jsonRequest,
        successCallback,
        errorCallback,
        baseClass
      );
    });
  }

  _updateAddress(id, jsonRequest, baseClass, successCallback, errorCallback) {
    SInfo.getItem("customer_id", {}).then(valueCustId => {
      this.callAPI(
        Constants.BASE_URL,
        "PUT",
        Constants.API_CUSTOMER + "/" + valueCustId + Constants.API_ADDRESS + "/" + id,
        jsonRequest,
        successCallback,
        errorCallback,
        baseClass
      );
    });
  }

  _getConfig(baseClass, successCallback, errorCallback) {
    SInfo.getItem("customer_id", {}).then(valueCustId => {
      SInfo.getItem("storeId", {}).then(value => {
        this.callAPI(
          Constants.BASE_URL,
          "GET",
          Constants.API_STORE + "/" + value + Constants.API_CUSTOMER + "/" + valueCustId,
          undefined,
          successCallback,
          errorCallback,
          baseClass
        );
      });
    });
  }

  _getAddress(baseClass, successCallback, errorCallback) {
    SInfo.getItem("customer_id", {}).then(valueCustId => {
      this.callAPI(
        Constants.BASE_URL,
        "GET",
        Constants.API_CUSTOMER + Constants.API_ADDRESS + "/" + valueCustId,
        undefined,
        successCallback,
        errorCallback,
        baseClass
      );
    });
  }

  _createCart(jsonRequest, baseClass, successCallback, errorCallback) {
    this.callAPI(
      Constants.BASE_URL,
      "POST",
      Constants.API_CART_ADD,
      jsonRequest,
      successCallback,
      errorCallback,
      baseClass
    );
  }

  _updateCart(id, jsonRequest, baseClass, successCallback, errorCallback) {
    this.callAPI(
      Constants.BASE_URL,
      "PUT",
      Constants.API_CART_ADD + "/" + id,
      jsonRequest,
      successCallback,
      errorCallback,
      baseClass
    );
  }

  _removeCartItem(id, productId, baseClass, successCallback, errorCallback) {
    SInfo.getItem("storeId", {}).then(value => {
      this.callAPI(
        Constants.BASE_URL,
        "DELETE",
        Constants.API_CART + "/" + id + Constants.API_STORE + "/" + value + Constants.API_PRODUCT + "/" + productId,
        undefined,
        successCallback,
        errorCallback,
        baseClass
      );
    });
  }

  _getCart(id, baseClass, successCallback, errorCallback) {
    SInfo.getItem("storeId", {}).then(value => {
      this.callAPI(
        Constants.BASE_URL,
        "GET",
        Constants.API_CART + "/" + id + Constants.API_STORE + "/" + value,
        undefined,
        successCallback,
        errorCallback,
        baseClass
      );
    });
  }

  _processOrder(jsonRequest, baseClass, successCallback, errorCallback) {
    this.callAPI(
      Constants.BASE_URL,
      "POST",
      Constants.API_PROCESS_ORDER,
      jsonRequest,
      successCallback,
      errorCallback,
      baseClass
    );
  }

  _search(jsonRequest, baseClass, successCallback, errorCallback) {
    this.callAPI(
      Constants.BASE_URL,
      "POST",
      Constants.API_SEARCH,
      jsonRequest,
      successCallback,
      errorCallback,
      baseClass
    );
  }

  log(response) {
    console.log(JSON.stringify(response));
  }

  static getInstance() {
    if (this.instance == undefined) {
      this.instance = new Service();
    }
    return this.instance;
  }

  callAPI(
    url,
    methodType,
    api,
    data,
    successCallback,
    errorCallback,
    baseClass
  ) {
    baseClass._showProgress();
    this.log(
      "URL : " + url + api + " \nMethod : " + methodType + " \nData : " + data
    );
    fetch(url + api, {
      method: methodType,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: data
    })
      .then(response => {
        return response.json();
      })
      .then(responseData => {
        this.log(responseData);
        baseClass._hideProgress();
        successCallback(responseData);
        this.log("success response returned");
        return responseData;
      })
      .catch(error => {
        errorCallback(error);
        this.log("In error " + error);
      });
  }
}
