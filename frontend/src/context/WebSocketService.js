// WebSocketService.js
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let stompClient = null;

export const getStompClient = (url) => {
	if (!stompClient) {
		// SockJS 인스턴스가 존재하지 않을 때만 새로 생성
		stompClient = new Client({
			webSocketFactory: () => new SockJS(url),
			onConnect: () => {
				console.log('Connected to WebSocket server');
			},
			onStompError: (frame) => {
				console.error('Broker reported error: ' + frame.headers['message']);
				console.error('Additional details: ' + frame.body);
			},
		});

		stompClient.activate();
	}

	return stompClient;
};

export const disconnectStompClient = () => {
	if (stompClient && stompClient.connected) {
		stompClient.deactivate();
		stompClient = null; // 연결 해제 후 인스턴스 참조 제거
		console.log('Disconnected from WebSocket server');
	}
};
