import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { AuthSession, WebBrowser, Linking } from 'expo'

export default class Login extends React.Component {
  state = {
    authResult: {},
  };
render() {

if (this.state.authResult.type && this.state.authResult.type === 'success') {
      return (
        <View style={styles.container}>
            <Text>{`Hey there, user!`}</Text>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <Button title="Login with Google" onPress={this.handleOAuthLogin} />
        </View>
      )
    }
  }
  handleRedirect = async event => {
      WebBrowser.dismissBrowser()
    }
  handleOAuthLogin = async () => {
      // gets the app's deep link
    let redirectUrl = await Linking.getInitialURL()
    // this should change depending on where the server is running
    let authUrl = `https://liberia.ngrok.io/auth/google`
    this.addLinkingListener()
    try {
      let authResult = await WebBrowser.openAuthSessionAsync(`https://liberia.ngrok.io/auth/google`, redirectUrl)
      WebBrowser.dismissBrowser()
      await this.setState({ authResult: authResult })
    } catch (err) {
      console.log('ERROR:', err)
    }
this.removeLinkingListener()
}
addLinkingListener = () => {
    Linking.addEventListener('url', this.handleRedirect)
}
removeLinkingListener = () => {
    Linking.removeEventListener('url', this.handleRedirect)
}
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
