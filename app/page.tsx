"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const initialState = {
    name: "",
    address: "",
    city: "",
    state: "",
    contact: "",
    email: "",
    image: "",
  }
  const [school, setSchool] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSchool({ ...school, [e.target.name]: e.target.value });
  };

  // Validate form
  const validateForm = () => {
    const { name, address, city, state, contact } = school;
    if (!name || !address || !city || !state || !contact) {
      alert("Please fill all required fields!");
      return false;
    }
    if (contact && !/^\d{10}$/.test(contact)) {
      alert("Contact must be a 10-digit number!");
      return false;
    }
    if (school.email && !/^\S+@\S+\.\S+$/.test(school.email)) {
      alert("Please enter a valid email!");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {setLoading(false); return};


    if (!file) return alert("Please select an image");

    const formData = new FormData();
    formData.append("name", school.name);
    formData.append("address", school.address);
    formData.append("city", school.city);
    formData.append("state", school.state);
    formData.append("contact", school.contact);
    formData.append("image", file); // Image
    formData.append("email", school.email);
    formData.append("created_by", "1");

    const res = await fetch("/api/schools", {
      method: "POST",
      body: formData, // ✅ sending FormData
    });

    const result = await res.json();
    console.log(result);
    setLoading(false);
    if(result.error){
      alert(result.error);
    }else{
    setSchool(initialState);
    alert("School added successfully")
    }
  };
  return (
    <div className="bg-amber-300">
      <div className="min-h-[90vh] flex flex-col">

        {/* Add school form */}
        <div className="w-[80vw] md:w-[60vw] h-[70vh] border rounded-xl p-5 mx-auto mt-5 flex flex-col">
          <div className="text-2xl font-bold mx-auto">Add School</div>
          <form onSubmit={(e) => { handleSubmit(e) }} className="flex flex-col flex-1 overflow-hidden">

            <div className="h-[50vh] w-full bg-amber-200 rounded-xl flex flex-col overflow-auto py-5">
              <label htmlFor="name" className="block ml-[5vw] text-sm font-medium text-gray-700"> Name: </label>
              <input id="name" name="name" value={school.name} placeholder="School Name" onChange={(e) => { handleChange(e) }} type="text" className="mx-auto my-2 w-10/12 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 required" />

              <label htmlFor="address" className="block ml-[5vw] text-sm font-medium text-gray-700">Address: </label>
              <input id="address" name="address" value={school.address} placeholder="Address" onChange={(e) => { handleChange(e) }} type="text" className="mx-auto my-2 w-10/12 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 required" />

              <label htmlFor="city" className="block ml-[5vw] text-sm font-medium text-gray-700">City: </label>
              <input id="city" name="city" value={school.city} placeholder="City" onChange={(e) => { handleChange(e) }} type="text" className="mx-auto my-2 w-10/12 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 required" />

              <label htmlFor="state" className="block ml-[5vw] text-sm font-medium text-gray-700">State: </label>
              <input id="state" name="state" value={school.state} placeholder="State" onChange={(e) => { handleChange(e) }} type="text" className="mx-auto my-2 w-10/12 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 required" />

              <label htmlFor="contact" className="block ml-[5vw] text-sm font-medium text-gray-700">Contact: </label>
              <input id="contact" name="contact" value={school.contact} placeholder="Contact" onChange={(e) => { handleChange(e) }} type="text" className="mx-auto my-2 w-10/12 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 required" />

              <label htmlFor="image" className="block ml-[5vw] text-sm font-medium text-gray-700">Image: </label>
              <input
                type="file"
                accept="image/*"
                id="image"
                name="image"
                className="mx-auto my-2 w-10/12 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500"
                required
                onChange={(e) => { setFile(e.target.files?.[0] || null) }} />

              <label htmlFor="email" className="block ml-[5vw] text-sm font-medium text-gray-700">Email: </label>
              <input id="email" name="email" value={school.email} placeholder="Email" onChange={(e) => { handleChange(e) }} type="text" className="mx-auto my-2 w-10/12 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500" />
            </div>
            <button type="submit" disabled={loading}
              className="my-auto px-4 py-2 mx-auto rounded-xl shadow-md font-semibold transition hover:opacity-90 disabled:opacity-50 bg-blue-500 cursor-pointer">
              Add School
            </button>
            {loading ? "Submitting..." : ""}

          </form>
        </div>
        {/* Explore schools button */}
        <button type="button" className="my-auto px-4 py-2 mx-auto rounded-xl shadow-md font-semibold transition hover:opacity-90 disabled:opacity-50 bg-blue-500 cursor-pointer"
          onClick={() => {
            router.push("/listing");
          }}>Explore Schools</button>
      </div>
    </div>
  );
}