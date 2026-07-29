import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <aside className="w-64 h-screen bg-slate-900 text-white">

            <div className="p-6 text-2xl font-bold border-b">
                Psychotest
            </div>

            <nav className="flex flex-col p-4 gap-2">

                <Link to="/dashboard">
                    Dashboard
                </Link>

                <Link to="/candidates">
                    Candidates
                </Link>

                <Link to="/tests">
                    Test Packages
                </Link>

                <Link to="/results">
                    Results
                </Link>

            </nav>

        </aside>
    );
}