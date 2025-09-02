"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
    const [search, setSearch] = useState("");
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!search.trim()) return;
        router.push(`/search?query=${encodeURIComponent(search)}`);
    }
    return (
        <div className="fixed top-0 left-0 w-[100vw] h-[15vh] md:h-[10vh] bg-blue-500 text-white flex flex-col z-50">
            <nav className="flex justify-between items-center px-6 h-full py-auto">
                <div className="text-xl font-bold">Logo</div>
                <form className="inline-block" onSubmit={(e) => { handleSubmit(e) }}>
                    <input type="text" value={search} placeholder="Search schools..." onChange={(e) => { setSearch(e.target.value) }} className="hidden text-center md:block w-[40vw] px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500" />
                </form>
                <div className="text-xl">Login</div>
            </nav>
            <form className="inline-block mx-auto" onSubmit={(e) => { handleSubmit(e) }}>
                <input type="text" value={search} placeholder="Search schools..." onChange={(e) => { setSearch(e.target.value) }} className="md:hidden text-center mx-auto my-2 w-[70vw] px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500" />
            </form>
        </div>
    );
}
