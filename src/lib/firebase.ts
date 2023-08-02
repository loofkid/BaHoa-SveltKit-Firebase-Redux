import { initializeApp } from 'firebase/app';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { derived, writable } from 'svelte/store';

const firebaseConfig = {
    apiKey: "AIzaSyAFqiZQzA1mSKDTlTcww-o_hBTEVNE1k_g",
    authDomain: "bahoa-cddd9.firebaseapp.com",
    databaseURL: "https://bahoa-cddd9-default-rtdb.firebaseio.com",
    projectId: "bahoa-cddd9",
    storageBucket: "bahoa-cddd9.appspot.com",
    messagingSenderId: "792879932944",
    appId: "1:792879932944:web:2a94bed6179448ca8a4c95",
    measurementId: "G-DRYVYL20LT"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

const userStore = () => {
    let unsubscribe: () => void;

    if (!auth || !globalThis.window) {
        console.warn('Auth is not initialized or not in browser');
        const  { subscribe } = writable<User | null>(null);
        return {
            subscribe,
        }
    }

    const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
        unsubscribe = onAuthStateChanged(auth, (user) => {
            set(user);
        });

        return () => unsubscribe();
    });

    return {
        subscribe,
    };
}

export const user = userStore();

export const docStore = <T>(path: string) => {
    let unsubscribe: () => void;

    const docRef = doc(db, path);

    const { subscribe } = writable<T | null>(null, (set) => {
        unsubscribe = onSnapshot(docRef, (snapshot) => {
            set(snapshot.data() as T ?? null);
        });

        return () => unsubscribe();
    });

    return {
        subscribe,
        ref: docRef,
        id: docRef.id,
    };
}

interface UserData {
    username: string;
    photoURL: string;
}

export const userData = derived(user, ($user, set) => {
    if ($user) {
        return docStore<UserData>(`users/${$user.uid}`).subscribe(set);
    } else {
        set(null);
    }
});