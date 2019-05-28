import React, { Component } from 'react';
import braintree from 'braintree-web-drop-in';
import braintreeWeb from 'braintree-web';
import BraintreeDropin from 'braintree-dropin-react';
import logo from './logo.svg';
import './App.css';

const token = 'YOUR CLIENT TOKEN';

const renderSubmitButton = ({ onClick, isDisabled, text }) => {
  return (
    <button onClick={onClick} disabled={isDisabled}>
      {text}
    </button>
  );
};

class App extends Component {
  handlePaymentMethod = payload => {
    console.log('Input for 3D verify card: ', payload);

    braintreeWeb.client
      .create({ authorization: token })
      .then(client => braintreeWeb.threeDSecure.create({ client }))
      .then(threeDSecure =>
        threeDSecure.verifyCard({
          nonce: payload.nonce,
          amount: '10.00',
          addFrame: (err, iframe) => {
            if (err) console.log(err);
            else this.popup.appendChild(iframe);
          },
          removeFrame: () => (this.popup.innerHTML = ''),
        }),
      )
      .then(result => console.log('Result: ', result))
      .catch(err => console.log(err));
  };

  onCreate = instance => {
    console.log('onCreate');
  };

  onDestroyStart = () => {
    console.log('onDestroyStart');
  };

  onDestroyEnd = () => {
    console.log('onDestroyEnd');
  };

  onError = error => {
    console.log('onError', error);
  };

  render() {
    return (
      <div className="App">
        <BraintreeDropin
          braintree={braintree}
          options={{
            locale: 'en_US',
            vaultManager: false,
          }}
          authorizationToken={token}
          handlePaymentMethod={this.handlePaymentMethod}
          onCreate={this.onCreate}
          onDestroyStart={this.onDestroyStart}
          onDestroyEnd={this.onDestroyEnd}
          onError={this.onError}
          renderSubmitButton={renderSubmitButton}
        />

        <div ref={node => (this.popup = node)} />
      </div>
    );
  }
}

export default App;
