import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';

const Header = ({ handleLogoPress }) => {
  return (
    <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleLogoPress}>
            <Image 
                style={styles.logo}
                source={require('../assets/icon.png')}
            />
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#f5f5f5',
    width: '100%',
  },
  logo: {
    width: 80,
    height: 80,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Header;
