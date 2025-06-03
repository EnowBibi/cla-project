import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  useEffect(()=>{
    setTimeout(()=>{
      router.push("/signup");
    },2000)
  },[])
  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/logo.png')} style={styles.image} />
      <View style={{flexDirection:'column', margin:30,}}>
        <View style={styles.textContainer}>
          <Text style={styles.goldText}>TITHES</Text>
          <View style={styles.andContainer}>
            <Text style={styles.and} >&</Text>
          </View>
        </View>
          <Text style={styles.goldText}>OFFERINGS</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 

    alignItems: 'center', 
    backgroundColor:"#ffffff"
  },
  image: {
    height: 177,
    width: 178,
  },
  textContainer:{
    flexDirection:"row",
    gap:10,
    alignItems:"center"
  },
  goldText:{
    color:'#FFD700',
    fontSize:50,
    fontWeight:'bold',
  },
  and:{
    color:'#FFFFFF',
    fontSize:40,
    fontWeight:'bold',
  },
  andContainer:{
    width:50,
    height:50,
    borderRadius:30,
    backgroundColor:'#EB1A1A',
    justifyContent: 'center', 
    alignItems: 'center', 
  },
})
