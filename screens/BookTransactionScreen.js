
import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import firebase from 'firebase';
import db from '../config';

export default class TransactionScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      hasCameraPermissions: null,
      scanned: false,
      scannedData: '',
      buttonState: 'normal',
      scannedBookId: '',
      scannedStudentId: '',
      transactionmesg: '',
    };
  }

  getCameraPermissions = async (id) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({
      /*status === "granted" is true when user has granted permission
          status === "granted" is false when user has not granted the permission
        */
      hasCameraPermissions: status === 'granted',
      buttonState: id,
      scanned: false,
    });
  };

  handleBarCodeScanned = async ({ type, data }) => {
    const { buttonState } = this.state;
    if (buttonState === 'BookId') {
      this.setState({
        scanned: true,
        scannedBookId: data,
        buttonState: 'normal',
      });
    } else if (buttonState === 'StudentId') {
      this.setState({
        scanned: true,
        scannedStudentId: data,
        buttonState: 'normal',
      });
    }
  };
  initiateBookIssue = async () => {
    //adda transaction
    db.collection('transaction').add({
      studentId: this.state.scannedStudentId,
      bookId: this.state.scannedBookId,
      date: firebase.firestore.Timestamp.now().toDate(),
      transactionType: 'Issue',
    }); //change book availibility status if book is issued
    db.collection('books').doc(this.state.scannedBookId).update({
      bookAvail: false,
    });
    //chaange no of issued books for the student
    db.collection('student')
      .doc(this.state.scannedStudentId)
      .update({
        noofBooks: firebase.firestore.FieldValue.increment(1),
      });
    alert('book issued');
    this.setState({
      scannedBookId: '',
      scannedStudentId: '',
    });
  };
  initiateBookReturn = async () => {
    //add atransaction
    db.collection('transaction').add({
      studentId: this.state.scannedStudentId,
      bookId: this.state.scannedBookId,
      date: firebase.firestore.Timestamp.now().toDate(),
      transactionType: 'Return',
    });
    //change book status
    db.collection('student').doc(this.state.scannedStudentId).update({
      bookAvail: 'true',
    });
    //change no of books issued for students
    db.collection('student')
      .doc(this.state.scannedStudentId)
      .update({
        noofBooks: firebase.firestore.FieldValue.increment(-1),
      });
    alert('Book Returned');
    this.setState({
      sacnnedBookId: '',
      scannedStudentId: '',
    });
  };
  handleTransaction = () => {
    var transactionmesg = null;
    db.collection('books')
      .doc(this.state.scannedBookId)
      .get()
      .then((doc) => {
        console.log(doc.data());
        var book = doc.data();
        if (book.bookAvail) {
          this.initiateBookIssue();
          transactionmesg = 'book Issued';
        } else {
          this.initiateBookReturn();
          transactionmesg = 'book Returned';
        }
      });
    this.setState({
      transactionmesg: transactionmesg,
    });
  };
  render() {
    const hasCameraPermissions = this.state.hasCameraPermissions;
    const scanned = this.state.scanned;
    const buttonState = this.state.buttonState;

    if (buttonState !== 'normal' && hasCameraPermissions) {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      );
    } else if (buttonState === 'normal') {
      return (
        <View style={styles.container}>
          <View>
            <Image
              source={require('../assets/booklogo.jpg')}
              style={{ width: 200, height: 200 }}
            />
            <Text style={{ textAlign: 'center', fontSize: 30 }}>WILLY</Text>
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputBox}
              placeholder="Book Id"
              onChangeText={(text) => {
                this.setState({
                  scannedBookId: text,
                });
              }}
              value={this.state.scannedBookId}
            />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => {
                this.getCameraPermissions('BookId');
              }}>
              <Text style={styles.buttonText}>scan</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputBox}
              placeholder="Student Id"
              onChangeText={(text) => {
                this.setState({
                  scannedStudentId: text,
                });
              }}
              value={this.state.scannedStudentId}
            />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => {
                this.getCameraPermissions('StudentId');
              }}>
              <Text style={styles.buttonText}>scan</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={async () => {
                this.handleTransaction();
              }}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: 'green',
    width: 100,
    height: 50,
    marginTop: 50,
    // left: -150,
  },
  submitButtonText: {
    fontSize: 15,
    padding: 10,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    //marginTop: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: '#2196F3',
    width: 50,
    height: 40,
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 5,
  },
  inputView: {
    flexDirection: 'row',
    margin: 20,
  },
  inputBox: {
    width: 150,
    height: 40,
    borderWidth: 1.5,
    fontSize: 20,
    //left: -60,
  },
});




/*import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet,TextInput,Image } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import firebase from 'firebase';
import db from "../config";
export default class TransactionScreen extends React.Component {
    constructor(){
      super();
      this.state = {
        hasCameraPermissions: null,
        scanned: false,
        scannedData: '',
        buttonState: 'normal',
        scannedBookId:'',
        scannedStudentId:'',
        transactionmesg:""
      }
    }

    getCameraPermissions = async (id) =>{
      const {status} = await Permissions.askAsync(Permissions.CAMERA);
      
      this.setState({
        
        hasCameraPermissions: status === "granted",
        buttonState: id,
        scanned: false
      });
    }

    handleBarCodeScanned = async({type, data})=>{
      const{buttonState}=this.state
      if(buttonState==="BookId"){
      this.setState({
        scanned: true,
        scannedBookId: data,
        buttonState: 'normal'
      });
    }
    else if(buttonState==="StudentId"){
      this.setState({
        scanned: true,
        scannedStudentId: data,
        buttonState: 'normal'
      });   
    }
    }
    
handleTransaction=()=>{
  var transactionmesg=null
db.collection("books")
.doc(this.state.scannedBookId)
.get()
.then((doc)=>{
 // console.log(doc.data())
  var book=doc.data()
  if(book.bookAvail){
    this.initiateBookIssue()
    transactionmesg="book Issued"
  }
  else{
    this.initiateBookReturn()
    transactionmesg="book Returned"
  }
})
this.setState({
  transactionmesg:transactionmesg
})
}
    render() {
      const hasCameraPermissions = this.state.hasCameraPermissions;
      const scanned = this.state.scanned;
      const buttonState = this.state.buttonState;

      if (buttonState !== "normal" && hasCameraPermissions){
        return(
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        );
      }

      else if (buttonState === "normal"){
        return(
          <View style={styles.container}>
            <View>
              <Image source={require("../assets/booklogo.jpg")}
              style={{width:200,height:200}}/>
              <Text style={{textAlign:'center',fontSize:30}}>WILLY</Text>
            </View>
            <View style={styles.inputView}>
              <TextInput 
              style={styles.inputBox}
              placeholder="BookId"
              value={this.state.scannedBookId}/>
              <TouchableOpacity
               style={styles.scanButton}
              onPress={()=>{
                  this.getCameraPermissions('BookId')
              }}>
                <Text style={styles.buttonText}>scan</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputView}>
              <TextInput 
              style={styles.inputBox}
              placeholder="StudentId"
              value={this.state.scannedStudentId}/>
              <TouchableOpacity 
              style={styles.scanButton}
              onPress={()=>{
                this.getCameraPermissions("StudentId")
              }}>
                <Text style={styles.buttonText}>scan</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} 
              onPress={async()=>{this.handleTransaction()}}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>

      </View>
        );
      }
    }
  }

  const styles = StyleSheet.create({
    submitButton:{
      backgroundColor: 'green',
      width:100,
      height:50
    },
    submitButtontext:{
      fontSize: 20,
      textAlign:'center',
      marginTop:20
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    scanButton:{
      backgroundColor: '#2196F3',
      width:50,
      borderWidth:1.5,
      borderLeftWidth:0,
      padding: 10,
      margin: 10
    },
    buttonText:{
      fontSize: 20,
      textAlign:'center',
      marginTop:20
    },
    inputView:{
      flexDirection:'row',
      margin:20
    },
    inputBox:{
      width:200,
      height:40,
      borderWidth:1.5,
      borderRightWidth:0,
      fontSize:20
    }
    
  });*/