import { Outlet, useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';

export function AnimatedLayout() {
    const location = useLocation();
    const element = useOutlet(); // Gets the current route component

    return (
        // mode="wait" ensures the old page exits before the new one enters
        <AnimatePresence mode="wait" initial={false}>
            {/* The Header will be here. */}
            {/* The key is crucial: it tells AnimatePresence that the component has changed */}
            <div key={location.pathname} className="min-h-screen">
                {element}
            </div>
        </AnimatePresence>
    );
}