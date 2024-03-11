"use client";
import React, { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { addNotification } from "@/stores/reducers/notificationReducer";
import { useDispatch, useSelector } from "react-redux";

import AddUser from "@/apiHelper/addUser";
const Register = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.general.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    const response = await AddUser({
      name: name,
      email: email,
      password: password,
      token: user.token,
    });
    if (response.success === true) {
      dispatch(
        addNotification({
          id: new Date().valueOf(),
          message: " Registration successfull",
          open: true,
          severity: "success",
        })
      );
      setLoading(false);

      setName("");
      setEmail("");
      setPassword("");
    } else {
      dispatch(
        addNotification({
          id: new Date().valueOf(),
          message: "Registration failed",
          open: true,
          severity: "error",
        })
      );
      setLoading(false);
    }
  };

  return (
    <div className="w-ful pt-10 flex justify-center px-10 lg:px-20">
      <div className="space-y-4 w-full lg:w-4/12">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-lg font-semibold">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="text-lg font-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="text-lg font-semibold">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded"
            required
          />
        </div>

        <div>
          <button
            onClick={handleRegister}
            className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {" "}
            {loading ? <div className = "text-white "><CircularProgress  color="inherit" size={20} /></div> : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
