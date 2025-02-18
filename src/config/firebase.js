import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { updateAdmin } from '../api/adminApi';

const firebaseConfig = {
    apiKey: "AIzaSyBjpkljoWuhxqQReo1vzGrkJPyJOPhmby4",
    authDomain: "betser-f5b9a.firebaseapp.com",
    projectId: "betser-f5b9a",
    storageBucket: "betser-f5b9a.firebasestorage.app",
    messagingSenderId: "265691676189",
    appId: "1:265691676189:web:4d635fc7e59b7763f1d0f4",
    measurementId: "G-XY1QQD9C9N"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Register the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
            console.log('Service Worker registered successfully:', registration);
        })
        .catch((error) => {
            console.error('Service Worker registration failed:', error);
        });
}

export const requestPermission = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            throw new Error('Permission not granted for notifications');
        }
        const token = await getToken(messaging, {
            vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: await navigator.serviceWorker.ready,
        });
        console.log('FCM Token:', token);
        localStorage.setItem('fcm_token', token);
        await sendAdminTokenToBackend(token);
    } catch (error) {
        console.error('Permission denied or error getting token:', error);
    }
};

export const sendAdminTokenToBackend = async (token) => {
    try {
        const data = await updateAdmin({ fcm_token: token })
        console.log('Admin token saved:', data);
    } catch (error) {
        console.error('Error sending token to backend:', error);
    }
};

export { messaging, onMessage };