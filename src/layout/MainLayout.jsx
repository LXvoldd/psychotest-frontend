import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function MainLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            
            {/* Sidebar menggunakan posisi fixed di kiri */}
            <Sidebar />

            {/* Konten utama digeser ke kanan selebar sidebar (w-64 = 16rem/256px) */}
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                
                <Navbar />

                <main className="flex-1 p-8">
                    {children}
                </main>

            </div>
        </div>
    );
}