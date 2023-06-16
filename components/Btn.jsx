import { View, Button, StyleSheet, Text } from 'react-native';

const Btn = ( {onPress, title} ) => {
  return (
    <View style={styles.buttonContainer}>
       <Button color={'#FE633D'} onPress={onPress} title={title} />
      

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
});

export default Btn;
