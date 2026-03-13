import { titulo } from './util';
import titulo_padrao from './util';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{titulo}</Text>
      <Text style={{margin: 20}}>{titulo_padrao}</Text>
      <Text style={styles.text}>AAA</Text>
      <Button title="Clique aqui" /> 
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
   text: {
    mragin: 20,
  },
});
