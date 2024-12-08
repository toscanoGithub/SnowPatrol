import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Button, Icon, IconElement } from '@ui-kitten/components'
import { MaterialIcons } from '@expo/vector-icons';
import theme from "../theme.json"

interface ActionButtonProps {
    onPress: () => void;
    iconName: string;
    label?: string; // Optional prop for the label text
  }

const ActionSheetAddButton: React.FC<ActionButtonProps> = ({ onPress, iconName, label }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.iconWrapper}>
        <MaterialIcons name={iconName as any} size={30} color="white" />
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  )
}

export default ActionSheetAddButton

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        right: 20,
        bottom: 20,
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
      },
      iconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      label: {
        position: 'absolute',
        top: 65,
        fontSize: 12,
        color: '#000',
        textAlign: 'center',
      },
})