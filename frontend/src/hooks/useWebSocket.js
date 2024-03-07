import { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const useWebSocket = (url) => {
	const [stompClient, setStompClient] = useState(null);
	const [connected, setConnected] = useState(false);

	useEffect(() => {
		const client = new Client({
			// SockJS 연결을 위한 webSocketFactory 함수 설정
			webSocketFactory: () => new SockJS(url),

			// 연결이 성공적으로 설정되었을 때의 콜백 함수
			onConnect: () => {
				setConnected(true);
		//		console.log('WebSocket Connected: ', url);
				// 여기에 추가적인 구독 설정 등을 추가할 수 있음
			},

			// 연결에 오류가 발생했을 때의 콜백 함수
			onStompError: (error) => {
				console.error('WebSocket Error: ', error);
				setConnected(false);
			}
		});

		// Stomp 클라이언트 활성화
		client.activate();
		setStompClient(client);

		// 컴포넌트 언마운트 시 연결 종료
		return () => {
			if (client && client.active) {
				client.deactivate(() => {
		//			console.log('WebSocket Disconnected: ', url);
				});
			}
		};
	}, [url]); // url이 변경될 때마다 연결을 다시 설정

	return { stompClient, connected };
};

export default useWebSocket;
