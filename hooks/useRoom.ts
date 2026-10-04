import { useEffect, useState, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { API_CONFIG } from '@/app/lib/config';

export const useRoom = (roomCode: string, token: string) => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [gameState, setGameState] = useState<any>(null);

    useEffect(() => {
        if (!roomCode || !token) return;

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${API_CONFIG.BASE_URL}/hubs/room?access_token=${token}`)
            .withAutomaticReconnect()
            .build();

        newConnection.on("ReceiveMessage", (message) => {
            setMessages(prev => [...prev, message]);
        });

        newConnection.on("GameStarted", (state) => {
            setGameState(state);
        });

        newConnection.on("GameStateUpdated", (state) => {
            setGameState(state);
        });

        newConnection.start()
            .then(() => {
                newConnection.invoke("JoinRoom", roomCode, "User");
            })
            .catch(console.error);

        setConnection(newConnection);

        return () => {
            newConnection.stop();
        };
    }, [roomCode, token]);

    const sendMessage = useCallback(async (sender: string, text: string) => {
        if (connection?.state === signalR.HubConnectionState.Connected) {
            await connection.invoke("SendMessage", roomCode, sender, text);
        }
    }, [connection, roomCode]);

    const makeTicTacToeMove = useCallback(async (cellIndex: number) => {
        if (connection?.state === signalR.HubConnectionState.Connected) {
            await connection.invoke("MakeMove", roomCode, cellIndex);
        }
    }, [connection, roomCode]);

    return {
        connection,
        messages,
        gameState,
        sendMessage,
        makeTicTacToeMove
    };
};