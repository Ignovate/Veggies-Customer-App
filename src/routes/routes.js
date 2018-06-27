import React from "react";
import { DrawerNavigator } from "react-navigation";
import stackNavigator from "./StackNavigator";
import SideMenu from "../pages/sideMenu/SideMenu";
import HomePage from "../pages/home/Home";

const nav = (signedIn = false) => {
  return DrawerNavigator(
    {
      HomePage: {
        screen: stackNavigator(signedIn)
      }
    },
    {
      contentComponent: SideMenu,
      drawerWidth: 300,
      drawerBackgroundColor: "rgba(255,255,255,0.8)"
    }
  )
};

export default nav;
