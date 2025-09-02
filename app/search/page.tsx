"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("query") || "";

    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    console.log(query)

    useEffect(() => {
        if (!query) return;

        async function fetchResults() {
            try {
                setLoading(true);
                const res = await fetch(`/api/schools?search=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data?.data || []);
            } catch (err) {
                console.error("Search error:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchResults();
    }, [query]);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
                Search Results for: <span className="text-blue-600">{query}</span>
            </h2>

            {loading ? (
                <p>Loading...</p>
            ) : results.length === 0 ? (
                <p>No schools found.</p>
            ) : (
                results.map((school, i) => (
                    <div key={i} className="border rounded-lg p-4">
                        <img
                            src={school.image}
                            alt={school.name}
                            className="h-40 w-full object-cover mb-2"
                        />
                        <h2 className="text-xl font-bold">{school.name}</h2>
                        <p>{school.address}</p>
                        <p>
                            {school.city}, {school.state}
                        </p>
                    </div>
                ))

            )}
        </div>
    );
}
