import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, Links, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import Loader from "../components/Loader";

const SignUp = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const signUpHandler = (e) => {
    // e.target.id is what got changed
    setUserData((prev) => ({ ...prev, [e.target.id]: e.target.value.trim() }));
  };

  const signUpSubmitHandler = async (e) => {
    // send userdata object to backend
    e.preventDefault();
    // check
    if (!userData.username || !userData.email || !userData.password) {
      return setErrorMessage("Please fill out all fields");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!data.success) {
        return setErrorMessage(data.message);
      }
      if (res.ok) {
        setLoading(false);
        navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };
  return loading ? (
    <Loader></Loader>
  ) : (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="flex p-3 max-w-5xl mx-auto max-sm:flex-col md:items-center gap-5">
        {/* left side */}
        <div className="flex-1">
          <Link
            to="/"
            className="text-6xl max-lg:text-5xl max-md:text-4xl max-sm:text-3xl font-bold dark:text-white"
          >
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg">
              Kaushal's
            </span>
            <span className="text-black">Blog</span>
          </Link>
          <p className="mt-5 text-sm text-gray-700 font-medium">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minima
            omnis maxime nam? Dolores, dignissimos delectus.
          </p>
        </div>
        {/* right side */}
        <div className="flex-1">
          <form
            className="flex flex-col gap-4"
            onChange={signUpHandler}
            onSubmit={signUpSubmitHandler}
          >
            <div>
              <Label value="Your username"></Label>
              <TextInput
                type="text"
                placeholder="Jon doe"
                id="username"
              ></TextInput>
            </div>
            <div>
              <Label value="Your email"></Label>
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
              ></TextInput>
            </div>
            <div>
              <Label value="Your password"></Label>
              <TextInput
                type="password"
                placeholder="password"
                id="password"
              ></TextInput>
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm"></Spinner>
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <OAuth></OAuth>
          </form>
          <div className="flex gap-2 mt-3">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
          {/* error alert */}
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
