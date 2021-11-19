//import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View,Image } from 'react-native';
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import tabBarIcon from 'react-native-vector-icons';
import TransactionScreen from "./screens/BookTransactionScreen";
import SearchScreen from "./screens/SearchScreen";
export default class App extends React.Component {
  render(){
  return (<AppContainer />);
  }
}
const TabNavigator = createBottomTabNavigator({
  Transaction: { screen: TransactionScreen },
  Search: { screen: SearchScreen }
},
{
defaultNavigationOptions:({navigation})=>({
  tabBarIcon:({})=>{
    const routeName= navigation.state.routeName;
    console.log(routeName)
    if(routeName==="Transaction"){
      return(<Image source={require("./assets/transactionScreenImg.png")} style={{width:40,height:40}}/>)
    }
    else if (routeName==="Search"){
      return(<Image source={require("./assets/searchScreenImg.png")} style={{width:40,height:40}}/>)
    }
  }

})

});

const AppContainer = createAppContainer(TabNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
