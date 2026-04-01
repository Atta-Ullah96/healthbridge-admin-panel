import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { motion } from "framer-motion";
import Header from "../components/header";
export default function Layout() {
    const location = useLocation(); // 👈 Get current route

    return (
        <>

            <Header />
            <div className="flex min-h-screen bg-gray-100">

                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </>
    );
}