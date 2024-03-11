"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/stores/reducers/generalReducer";

export default function Payment() {
  const user = useSelector((state: any) => state.general.user);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    const logout = async () => {
      dispatch(setUser(null));
     router.push("/login");
    };

    logout();
  }, [dispatch, router, user]);

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <p>{"Logging you out... "}</p>
    </div>
  );
}