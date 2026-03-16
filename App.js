import { titulo } from './mensagens_entrada';
import titulo_padrao from './mensagens_entrada';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button,} from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{titulo}</Text>
      <Text style={{margin: 20}}>{titulo_padrao}</Text>
      <Button title="entrar" /> 
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
    margin: 20,
  },
});
