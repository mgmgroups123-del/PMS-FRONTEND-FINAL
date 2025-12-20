import { useSelector } from "react-redux";
import { selectProfile } from "../features/settings/reducers/selectors";
import { useEffect } from "react";
import socket from "./socketContext";

const profile = useSelector(selectProfile);
console.log("Profile", profile)

useEffect(() => {
  if (profile?._id && profile?.role) {
    socket.emit("register", { userId: profile._id, role: profile.role });
    console.log("🔌 Registered user with socket:", profile._id, profile.role);
  }
}, [profile]);