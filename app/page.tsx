"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  company: {
    name: string;
    department: string;
  };
  address: {
    city: string;
  };
};

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://dummyjson.com/users")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data.users);
        setLoading(false);
      })
      .catch(() => {
        setError("Something went wrong!");
        setLoading(false);
      });
  }, []);

  if (loading) return <h1 className="text-center mt-10">Loading...</h1>;

  if (error)
    return <h1 className="text-center mt-10 text-red-500">{error}</h1>;

  if (users.length === 0)
    return <h1 className="text-center mt-10">No Employees Found</h1>;

  return (
    <main className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">
        Employee Listing
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white p-5 rounded shadow">
            <h2 className="text-xl font-bold">
              {user.firstName} {user.lastName}
            </h2>

            <p>Email: {user.email}</p>
            <p>Company: {user.company.name}</p>
            <p>Department: {user.company.department}</p>
            <p>City: {user.address.city}</p>
            <p>Age: {user.age}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
