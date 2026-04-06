import { AppRegistry } from 'react-native';
import App from './src/App';

// 注册并启动
AppRegistry.registerComponent('App', () => App);
AppRegistry.runApplication('App', {
  initialProps: {},
  rootTag: document.getElementById('root'),
});
