// WebSocketContext.js
import React, {createContext, useContext, useEffect, useState} from 'react';
import {disconnectStompClient, getStompClient} from './WebSocketService';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {Client} from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WebSocketContext = createContext(null);

const getRoomList = async () => {
    try {
        const authHeader = localStorage.getItem('authHeader');
   //     console.log('Auth Header: ', authHeader);
        return await axios.post(`${process.env.REACT_APP_API_URL}/chatroom/roomlist`, {}, {
            headers: {
                'Authorization': authHeader,
            },
            withCredentials: true
        });
    } catch (error) {
        console.log('Get Room List Error: ', error);
        throw error;
    }
}

export const WebSocketProvider = ({children}) => {
    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [roomStatus, setRoomStatus] = useState([]);
    const {isLoggedIn, user} = useSelector(state => state.auth);
    const [isRefresh, setIsRefresh] = useState(false);

    useEffect(() => {
        setIsRefresh(true);
        // 새로고침 했을 때도 roomList를 가져오기 위해
    //    console.log('isLoggedIn: ', isLoggedIn);
        // if (roomStatus) setRoomStatus([]);
        if (isLoggedIn) {
            getRoomList()
                .then((response) => {
      //              console.log(response.data);
                    setRoomStatus(response.data);
                    //sessionStorage.setItem('roomList', JSON.stringify(response.data));
                }).catch((error) => {
                console.log('Get Room List Failed: ', error);
            });
        }
    }, []);

    useEffect(() => {
   //     console.log('roomStatus changed');
        if (connected) {
            // 받아온 roomList의 roomId로 구독하기
   //         console.log(roomStatus);
            roomStatus.forEach((room) => {
     //           console.log(room);
                subscribe(`/topic/messages/${room.id}`, (message) => {
     //               console.log('Message received');
                    setRoomStatus(prevStatus =>
                        prevStatus.map(r =>
                            r.id === room.id ? {...room, lastMessage: JSON.parse(message.body)} : r
                        )
                    );
                });
            });

            subscribe(`/topic/notification/${user.nickname}`, (message) => {
       //         console.log('notification received');
                getRoomList()
                    .then((response) => {
         //               console.log(message);
                        const messageData = JSON.parse(message.body); // 메시지 본문을 객체로 파싱
         //               console.log(messageData);
                        subscribe(`/topic/messages/${messageData.roomId}`, (message) => {
          //                  console.log('Message received');
                            const newMessage = JSON.parse(message.body);
                            setRoomStatus(prevStatus =>
                                prevStatus?.map(r =>
                                    r.id === messageData.roomId ? {...r, lastMessage: newMessage} : r
                                )
                            );
                        });

                        setRoomStatus(response.data);
                        //sessionStorage.setItem('roomList', JSON.stringify(response.data));
                    }).catch((error) => {
                    console.log('Get Room List Failed: ', error);
                });
            });

            setIsRefresh(false);
        }
   //     console.log(roomStatus);
    }, [connected]);



    useEffect(() => {
        if (stompClient) {
            const onConnect = () => {
       //         console.log('Connected to WebSocket server');
                setConnected(true); // 연결 상태 업데이트
            };

            stompClient.onConnect = onConnect;
            stompClient.activate();
        }

        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, [stompClient]);

    const connect = (url) => {
        if (!stompClient) {
            const newClient = new Client({
                webSocketFactory: () => new SockJS(url),
                onConnect: () => {
       //             console.log('Connected to WebSocket server');
                    setConnected(true); // 연결 상태 업데이트
                },
                onStompError: (frame) => {
                    console.error('Broker reported error: ' + frame.headers['message']);
                    console.error('Additional details: ' + frame.body);
                },
            });

            setStompClient(newClient);
        }
    };


    // const connect = (url) => {
    //     // const client = getStompClient(url);
    //     // setStompClient(client);
    //     // stompClient.activate();
    //
    //     if (!stompClient) {
    //         // SockJS 인스턴스가 존재하지 않을 때만 새로 생성
    //         setStompClient (new Client({
    //             webSocketFactory: () => new SockJS(url),
    //             onConnect: () => {
    //                 console.log('Connected to WebSocket server');
    //             },
    //             onStompError: (frame) => {
    //                 console.error('Broker reported error: ' + frame.headers['message']);
    //                 console.error('Additional details: ' + frame.body);
    //             },
    //         }));
    //
    //         stompClient.activate();
    //     }
    // };

    const disconnect = () => {
        // disconnectStompClient();
        if (stompClient && stompClient.connected) {
            stompClient.deactivate();
            setStompClient(null); // 연결 해제 후 인스턴스 참조 제거
            setConnected(false);
         //   console.log('Disconnected from WebSocket server');
        }
    };


    const subscribe = (destination, callback) => {
     //   console.log(stompClient);
     //   console.log(stompClient.connected);
        if (stompClient && stompClient.connected) {
            const subscription = stompClient.subscribe(destination, callback);
     //       console.log("Subscribed to " + destination);
            return subscription; // 구독 객체 반환
        }
        return null;
    };

    const sendMessage = (destination, body) => {
        if (stompClient && stompClient.connected) {
     //       console.log("in sendMessage " + destination);
            stompClient.publish({
                destination: destination,
                body: body,
            });
        }
    };

    return (
        <WebSocketContext.Provider value={{
            stompClient,
            connected,
            connect,
            disconnect,
            sendMessage,
            subscribe,
            roomStatus,
            setRoomStatus,
            getRoomList
        }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
