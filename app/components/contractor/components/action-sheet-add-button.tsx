import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import theme from "../../../theme.json"

interface ActionButtonProps {
    onPress: (type: string) => void;
    iconName: string;
    type: string; // Optional prop for the label text
  }

const ActionSheetAddButton: React.FC<ActionButtonProps> = ({ onPress, iconName, type }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={() => onPress(type)}>
      <View style={styles.iconWrapper}>
        <MaterialIcons name={iconName as any} size={30} color="white" />
      </View>
    </TouchableOpacity>
  )
}

export default ActionSheetAddButton

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        right: 20,
        bottom: 0,
        backgroundColor: theme["color-primary-500"], // Tomato color
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 30, // Adds shadow on Android
        shadowColor: theme["color-primary-900"], // Adds shadow on iOS
        shadowOpacity: 0.1,
        shadowRadius: 10,
        zIndex: 3000,
      },
      iconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      type: {
        position: 'absolute',
        top: 65,
        fontSize: 12,
        color: '#000',
        textAlign: 'center',
      },
})