import { router } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { logout } from '@/routes';

const IDLE_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

export function useIdleTimeout(enabled: boolean = true) {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        const handleIdle = () => {
            router.post(logout());
        };

        const resetTimer = () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            timerRef.current = setTimeout(handleIdle, IDLE_TIMEOUT_MS);
        };

        const events = [
            'mousemove',
            'mousedown',
            'keydown',
            'scroll',
            'touchstart',
        ];

        events.forEach((event) => {
            window.addEventListener(event, resetTimer, { passive: true });
        });

        resetTimer();

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            events.forEach((event) => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [enabled]);
}
