import React, {createContext, useContext, useState, useCallback, useEffect} from 'react';
import { OpenVidu } from 'openvidu-browser';

const VoiceSocketContext = createContext();

export const VoiceSocketProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [OV, setOV] = useState(new OpenVidu());
    const [participants, setParticipants] = useState([]);

    const [publisher, setPublisher] = useState(null);
    const [isCameraEnabled, setIsCameraEnabled] = useState(true); // 카메라 상태 관리
    const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(true); // 마이크 상태 관리

    const [users,setUsers] = useState(null);
    const [curUser,setCurUser] = useState(null);

    const connectToSession = useCallback(async (token) => {
        if (session) session.disconnect(); // 기존 세션 연결 해제

        const newSession = OV.initSession();
        newSession.on('streamCreated', event => {
            const subscriber = newSession.subscribe(event.stream, 'subscriberDiv');
            const nickname = event.stream.connection.data.split("=")[1];
            // 이전 상태를 기반으로 새 상태를 계산
            setParticipants(prevParticipants => [...prevParticipants, { subscriber, nickname }]);
    //        console.log(participants);
        });
        newSession.on('streamDestroyed', event => {
            const nickname = event.stream.connection.data.split("=")[1];
            setParticipants(prev => prev.filter(participant => participant.nickname !== nickname));
        });
        await newSession.connect(token);

        const newPublisher = OV.initPublisher('publisher-container', {
            videoSource: false, // 카메라 사용
            audioSource: true, // 마이크 사용
        });
        await newSession.publish(newPublisher);

        setPublisher(newPublisher);
        setSession(newSession);
    }, [OV, session]);

    const disconnectSession = useCallback(() => {
        if (session) {
    //        console.log(session);
            session.disconnect();
            setSession(null);
            setParticipants([]);
        }
    }, [session]);

    const toggleCamera = useCallback(() => {
        if (publisher) {
            const newIsCameraEnabled = !isCameraEnabled;
            publisher.publishVideo(newIsCameraEnabled);
            setIsCameraEnabled(newIsCameraEnabled);
        }
    }, [publisher, isCameraEnabled]);

    const toggleMicrophone = useCallback(() => {
        if (publisher) {
            const newIsMicrophoneEnabled = !isMicrophoneEnabled;
            publisher.publishAudio(newIsMicrophoneEnabled);
            setIsMicrophoneEnabled(newIsMicrophoneEnabled);
        }
    }, [publisher, isMicrophoneEnabled]);

    return (
        <VoiceSocketContext.Provider value={{
            session,
            participants,
            connectToSession,
            disconnectSession,
            setParticipants,
            toggleCamera,
            toggleMicrophone,
            isMicrophoneEnabled,
            setUsers,
            setCurUser
        }}>
            {children}

            <div id='subscriberDiv' style={{display:'none'}}></div>
            <div id='publisher-container' style={{display:'none'}}></div>


        </VoiceSocketContext.Provider>
    );
};

export const useVoiceSocket = () => useContext(VoiceSocketContext);
