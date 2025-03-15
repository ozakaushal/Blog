import { Sidebar } from "flowbite-react";
import {
  HiArrowSmallRight,
  HiDocumentText,
  HiUser,
  HiUserCircle,
  HiUserGroup,
} from "react-icons/hi2";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signOutSuccess } from "../redux/user/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { HiOutlineAnnotation } from "react-icons/hi";

const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get("tab");
    if (tabFromURL) {
      setTab(tabFromURL);
    }
  }, [location.search]);
  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/sign-out", {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=dash">
            <Sidebar.Item
              active={tab === "dash"}
              icon={HiDocumentText}
              labelColor="dark"
              as="div"
            >
              Dashboard
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser && currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser && (
            <Link to="/dashboard?tab=posts">
              <Sidebar.Item
                active={tab === "posts"}
                icon={HiDocumentText}
                labelColor="dark"
                as="div"
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}
          {currentUser && currentUser.isAdmin && (
            <Link to="/dashboard?tab=users">
              <Sidebar.Item
                active={tab === "users"}
                icon={HiUserGroup}
                labelColor="dark"
                as="div"
              >
                Users
              </Sidebar.Item>
            </Link>
          )}
          {currentUser && currentUser.isAdmin && (
            <Link to="/dashboard?tab=comments">
              <Sidebar.Item
                active={tab === "comments"}
                icon={HiOutlineAnnotation}
                labelColor="dark"
                as="div"
              >
                Comments
              </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item
            icon={HiArrowSmallRight}
            className="cursor-pointer"
            onClick={handleSignOut}
          >
            Sign out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
