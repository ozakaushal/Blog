import { Alert, Button, Modal, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  imageUploadEnd,
  imageUploadStart,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutSuccess,
} from "../redux/user/userSlice";
import { toast } from "react-toastify";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { data, Link } from "react-router-dom";

const DashProfile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoURL, setProfilePhotoURL] = useState("");
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const [showModal, setShowModal] = useState(false);

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files;
    if (file[0]) {
      setProfilePhoto(file[0]);
      setProfilePhotoURL(URL.createObjectURL(file[0]));
    }
  };

  useEffect(() => {
    if (profilePhoto) {
      setFormData({ ...formData, userPhoto: profilePhoto });
    }
  }, [profilePhoto]);

  useEffect(() => {
    if (profilePhoto) {
      uploadImage();
    }
  }, [profilePhoto]);

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("userPhoto", profilePhoto);
    try {
      dispatch(imageUploadStart());
      toast("Please wait while we upload your image...");
      const res = await fetch("/api/user/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        dispatch(imageUploadEnd());
        toast("Image uploaded, you can update now...");
        const data = await res.json();
        //set to formdata
        setFormData({ ...formData, userPhoto: data.url });
      }
    } catch (error) {
      dispatch(imageUploadEnd());
      console.log(error);
    }
  };

  const handleProfileUpdateChange = (e) => {
    if (
      e.target.id === "username" ||
      e.target.id === "email" ||
      e.target.id === "password"
    ) {
      setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    }
  };

  const submitUserData = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      toast("Nothing to change :)");
      return;
    }
    console.log(formData);
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast("Profile has been updated0", {
          closeButton: true,
          pauseOnHover: false,
          type: "success",
        });
        const data = await res.json();
        console.log(data);
        setFormData({});
        setProfilePhoto(null);
        setProfilePhotoURL("");
        dispatch(updateSuccess(data));
      } else {
        dispatch(updateFailure(data.message));
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        dispatch(deleteUserSuccess(data));
        toast("User deleted!!!", {
          type: "success",
        });
      } else {
        dispatch(deleteUserFailure(data.message));
        toast(data.message, {
          type: "error",
        });
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast(error.message, {
        type: "error",
      });
      console.log(error);
    }
  };

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
    <div className="max-w-xl mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form
        className="flex flex-col gap-4"
        onChange={handleProfileUpdateChange}
        onSubmit={submitUserData}
      >
        <input
          type="file"
          hidden
          id="file"
          ref={filePickerRef}
          name="profile_url"
          accept="image/*"
          onChange={handleProfilePhotoChange}
        />
        <div
          className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          <img
            src={profilePhotoURL || currentUser.userPhoto}
            alt="user-profile"
            className="rounded-full w-full h-full border-8 border-[lightGray] object-cover"
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
        ></TextInput>
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
        ></TextInput>
        <TextInput
          type="password"
          id="password"
          placeholder="Password"
        ></TextInput>
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          className="cursor-pointer"
          disabled={loading}
        >
          {!loading ? "Update" : "Uploading image..."}
        </Button>
        {currentUser && currentUser.isAdmin && (
          <Link to="/create-post">
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className="w-full"
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-4">
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleSignOut}>
          Sign Out
        </span>
      </div>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto"></HiOutlineExclamationCircle>
            <h3 className="mb-3 text-lg text-gray-400 dark:text-gray-200">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
