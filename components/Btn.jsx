import { View, Button, StyleSheet, Text } from 'react-native';

const Btn = ( {onPress, title} ) => {
  return (
    <View style={styles.buttonContainer}>
       <Button style={styles.button} onPress={onPress} title={title} />
      

    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 10,
    width: '100%',
  },
  button: {
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#FE633D',
  },
});

export default Btn;
