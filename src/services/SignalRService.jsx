// src/services/SignalRService.js
import * as signalR from '@microsoft/signalr';
import { API_BASE_URL } from '../utils/ApiUrl';

class SignalRService {
    constructor() {
        this.connection = null;
        this.isConnected = false;
        this.listeners = {};
    }

    // Initialize connection
    async startConnection(token) {
        debugger
        if (this.connection) {
            await this.stopConnection();
        }

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${API_BASE_URL}chathub`, {

                accessTokenFactory: () => token,
                transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
            })
            .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
            .configureLogging(signalR.LogLevel.Information)
            .build();

        // Handle reconnection events
        this.connection.onreconnecting((error) => {
            console.log('SignalR Reconnecting...', error);
            this.isConnected = false;
            this.emit('reconnecting');
        });

        this.connection.onreconnected((connectionId) => {
            console.log('SignalR Reconnected:', connectionId);
            this.isConnected = true;
            this.emit('reconnected');
        });

        this.connection.onclose((error) => {
            debugger
            console.log('SignalR Connection Closed', error);
            this.isConnected = false;
            this.emit('disconnected');
        });

        try {
            await this.connection.start();
            console.log('SignalR Connected');
            this.isConnected = true;
            this.emit('connected');

            this.pingInterval = setInterval(() => {
                if (this.connection && this.isConnected) {
                    this.connection.invoke("Ping").catch(err => console.error("Ping failed:", err));
                }
            }, 30000); // every 30 seconds
            return true;
        } catch (err) {
            console.error('SignalR Connection Error:', err);
            this.isConnected = false;
            throw err;
        }
    }

    // Stop connection
    async stopConnection() {
        if (this.connection) {
            try {
                clearInterval(this.pingInterval); 
                await this.connection.stop();
                this.connection = null;
                this.isConnected = false;
            } catch (err) {
                console.error('Error stopping connection:', err);
            }
        }
    }

    // Register event listeners
    on(eventName, callback) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(callback);

        // Register with SignalR if connection exists
        if (this.connection) {
            this.connection.on(eventName, callback);
        }
    }

    // Remove event listener
    off(eventName, callback) {
        if (this.listeners[eventName]) {
            this.listeners[eventName] = this.listeners[eventName].filter(cb => cb !== callback);
        }
        if (this.connection) {
            this.connection.off(eventName, callback);
        }
    }

    // Emit internal events
    emit(eventName, ...args) {
        if (this.listeners[eventName]) {
            this.listeners[eventName].forEach(callback => callback(...args));
        }
    }

    // Send message
    async sendMessage(messageDto) {
        if (!this.connection || !this.isConnected) {
            throw new Error('Not connected to chat server');
        }
        return await this.connection.invoke('SendMessage', messageDto);
    }

    // Mark messages as read
    async markAsRead(senderID) {
        if (!this.connection || !this.isConnected) {
            throw new Error('Not connected to chat server');
        }
        return await this.connection.invoke('MarkAsRead', senderID);
    }

    // Send typing indicator
    async typing(receiverID) {
        if (!this.connection || !this.isConnected) return;
        return await this.connection.invoke('Typing', receiverID);
    }

    // Stop typing indicator
    async stopTyping(receiverID) {
        if (!this.connection || !this.isConnected) return;
        return await this.connection.invoke('StopTyping', receiverID);
    }

    // Get connection status
    getConnectionState() {
        return this.isConnected;
    }
}

// Export singleton instance
export const signalRService = new SignalRService();