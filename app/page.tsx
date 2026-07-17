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

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");

  // Task 1: API se employees fetch karna
  useEffect(() => {
    fetch("https://dummyjson.com/users")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch employees");
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

  // Task 2: 500ms debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Task 2: Search filtering
  const filteredUsers = users.filter((user) => {
    const searchText = debouncedSearch.toLowerCase().trim();

    const fullName =
      `${user.firstName} ${user.lastName}`.toLowerCase();

    return (
      fullName.includes(searchText) ||
      user.email.toLowerCase().includes(searchText) ||
      user.company.name.toLowerCase().includes(searchText) ||
      user.address.city.toLowerCase().includes(searchText)
    );
  });

  // Task 3: Sorting without changing original array
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortBy) return 0;

    let result = 0;

    if (sortBy === "name") {
      result = a.firstName.localeCompare(b.firstName);
    }

    if (sortBy === "age") {
      result = a.age - b.age;
    }

    if (sortBy === "company") {
      result = a.company.name.localeCompare(b.company.name);
    }

    return order === "asc" ? result : -result;
  });

  if (loading) {
    return (
      <h1 className="mt-10 text-center text-xl">
        Loading...
      </h1>
    );
  }

  if (error) {
    return (
      <h1 className="mt-10 text-center text-xl text-red-500">
        {error}
      </h1>
    );
  }

  if (users.length === 0) {
    return (
      <h1 className="mt-10 text-center text-xl">
        No Employees Found
      </h1>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-900">
        Employee Listing
      </h1>

      {/* Task 2: Search input */}
      <input
        type="text"
        placeholder="Search by Name, Email, Company or City"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full rounded-lg border bg-white p-3 text-gray-900"
      />

      {/* Task 3: Sorting dropdowns */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border bg-white p-3 text-gray-900"
        >
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="age">Age</option>
          <option value="company">Company</option>
        </select>

        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="rounded-lg border bg-white p-3 text-gray-900"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {sortedUsers.length === 0 ? (
        <p className="mt-10 text-center text-gray-600">
          No matching employees found
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedUsers.map((user) => (
            <div
              key={user.id}
              className="rounded-lg bg-white p-5 text-gray-900 shadow"
            >
              <h2 className="mb-3 text-xl font-bold">
                {user.firstName} {user.lastName}
              </h2>

              <p>
                <strong>Email:</strong> {user.email}
              </p>

              <p>
                <strong>Company:</strong> {user.company.name}
              </p>

              <p>
                <strong>Department:</strong>{" "}
                {user.company.department}
              </p>

              <p>
                <strong>City:</strong> {user.address.city}
              </p>

              <p>
                <strong>Age:</strong> {user.age}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}