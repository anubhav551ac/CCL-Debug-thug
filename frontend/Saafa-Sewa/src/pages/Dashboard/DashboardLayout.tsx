import { Outlet, useLocation } from "react-router-dom"
import DashboardNavbar from "./DashboardNavbar"
import DashboardHeader from "@/components/DashboardHeader"
import { AnimatePresence, motion } from "motion/react"
import { useFetchUserData } from "@/hooks/useFetchUserData"


function DashboardLayout() {
    const location = useLocation();
    useFetchUserData(); // Fetch user data when dashboard loads


    return (
        <div className="flex h-screen bg-background overflow-hidden">

            <DashboardNavbar />
            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden py-4 pr-4">
                <DashboardHeader currentScreen={location.pathname} />
                {/* Screen Content */}
                <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            className="h-full"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    )
}

export default DashboardLayout