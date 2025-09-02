"use client";
import { useEffect, useState } from "react";

export default function SchoolsPage() {
  const [schools, setSchools] = useState<any[]>([]); // ✅ always array
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 5; // items per page
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await fetch(`/api/schools?page=${page}&limit=${limit}`);
        
        const data = await res.json();
        // ✅ handle { data: [...] }
        if (data?.data && Array.isArray(data.data)) {
          setSchools(data.data);
          setTotalPages(data.pagination.totalPages);
        } else {
          console.error("Unexpected response format:", data);
          alert(data.error);
          setSchools([]);
        }
      } catch (err) {
        console.error("Error fetching schools:", err);
        setSchools([]);
      }
    };

    fetchSchools();
  }, [page,limit]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Schools List</h1>

      {schools.length === 0 ? (
        <p>No schools found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {schools.map((school, i) => (
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
          ))}
        </div>
      )}
      {/* Pagination Controls */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
