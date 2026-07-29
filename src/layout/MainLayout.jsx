import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function MainLayout({ children }) {

    return (

        <div className="flex">

            <Sidebar />

            <div className="flex-1">

                <Navbar />

                <main className="p-8 bg-gray-100 min-h-screen">

                    {children}

                </main>

            </div>

        </div>

    );

}