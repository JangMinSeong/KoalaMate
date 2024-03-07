import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import {WebSocketProvider} from './context/WebSocketContext';
import App from './App';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from 'store/store';
import {VoiceSocketProvider} from "./context/VoiceSocketContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
		<Provider store={store}>
			<PersistGate loading={<div>Loading...</div>} persistor={persistor}>
				<WebSocketProvider>
					<VoiceSocketProvider>
					{/*<React.StrictMode>*/}
						<App/>
					{/*</React.StrictMode>*/}
					</VoiceSocketProvider>
				</WebSocketProvider>
			</PersistGate>
		</Provider>,
);
