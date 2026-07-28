import {createContext, type ReactNode, useContext, useMemo, useState} from "react";
import {NotificationType} from "../types/NotificationType.ts";
import type {FrontendNotification} from "../models/FrontendNotification.ts";

interface NotificationContextType {
    notify: (message: string,type?: NotificationType,duration?: number) => void;
    notifications: FrontendNotification[];
    remove: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({children}: {children: ReactNode}) {
    const [notifications, setNotifications] = useState<FrontendNotification[]>([]);

    function remove(id: number) {
        setNotifications(old => old.filter(n => n.id !== id));
    }

    function notify(message: string,type: NotificationType = NotificationType.Info,duration = 3000) {
        const id = Date.now();

        setNotifications(old => [
            ...old,
            {id, message, type}
        ]);

        setTimeout(() => remove(id), duration);
    }

    const value = useMemo(() => ({
        notify,
        notifications,
        remove
    }), [notifications]);


    // TODO
    return (
        <NotificationContext.Provider value={value}>
            {children}
            </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error(
            "useNotifications must be used inside NotificationProvider"
        );
    }

    return context;
}