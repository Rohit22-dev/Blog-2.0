"use client";
import React, { useEffect, useState } from "react";
import { Avatar } from "@nextui-org/react";
import axios from "axios";

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get("https://blog-zlon.onrender.com/users");
        setAllUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, []);

  return (
    <div className="h-fit bg-foreground-100 rounded-md p-3">
      <div className="flex flex-col border-primary-500 gap-2 border max-h-64 rounded-md p-2 divide-y overflow-y-scroll">
        <p className="font-semibold text-base text-center">Users</p>
        {allUsers?.map((user: any) => (
          <div className="flex gap-3 items-center p-1" key={user._id}>
            <Avatar showFallback src={user?.image?.url} />
            <p className="text-sm">{user.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
