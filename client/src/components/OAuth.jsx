import { Button } from "flowbite-react";
import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  signInSuccess,
  signInFailure,
  signInStart,
} from "../redux/user/userSlice";

// {
//   "user": {
//       "uid": "Ls6egHvwOiObequEsaYkRKVNRcj2",
//       "email": "kaushaloza8@gmail.com",
//       "emailVerified": true,
//       "displayName": "Kaushal Oza",
//       "isAnonymous": false,
//       "photoURL": "https://lh3.googleusercontent.com/a/ACg8ocI-IA0C6Xff7p1yTrvoXOR1TmfIjDpdZN-yTXjOOSC02Wvl_w=s96-c",
//       "providerData": [
//           {
//               "providerId": "google.com",
//               "uid": "112077955189348697705",
//               "displayName": "Kaushal Oza",
//               "email": "kaushaloza8@gmail.com",
//               "phoneNumber": null,
//               "photoURL": "https://lh3.googleusercontent.com/a/ACg8ocI-IA0C6Xff7p1yTrvoXOR1TmfIjDpdZN-yTXjOOSC02Wvl_w=s96-c"
//           }
//       ],
//       "stsTokenManager": {
//           "refreshToken": "AMf-vBzwRME6gUtNOhuzLwDhAe_OSilZv7DPzGWIDXlV0fDslBpp0r18KgTkGP1iqL0WUywhU5_wXSyh2GqRsbm2uQOGG9yHlv6LrfE2Uv2zXxeU8iwWZm9MDiFcFgMgGnXStSFxq88fagJ8LH29QJrRjcFFr9x7JtmV6BwIiWORFGAorlRakdh2W9cOzYTguXiREEppLIV1RmXn2jAAQv5jQDxMFLOcefnqujR2wxfhrtemlpN09ldy0hP0ftOfBnM79JP7YFs8mn4BV35GfZ_Di3IT025lUL0ZZ3Scf5BhBkookPYa_F1zQRM_UFydj9c3E6Pijj-i9aoaZ0spwLid-WasFurUG3edboGwT6WMBHWLNOKhEpASOt_cKfnoYzqWwX0gskh4yZCchRsa1iMPZwnw6MUjRHv9k1CnEhogtNl-eByERQI",
//           "accessToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjhkMjUwZDIyYTkzODVmYzQ4NDJhYTU2YWJhZjUzZmU5NDcxNmVjNTQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiS2F1c2hhbCBPemEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSS1JQTBDNlhmZjdwMXlUcnZvWE9SMVRtZklqRHBkWk4teVRYak9PU0MwMld2bF93PXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2thdXNoYWwtYmxvZyIsImF1ZCI6ImthdXNoYWwtYmxvZyIsImF1dGhfdGltZSI6MTczOTYwMTcxMiwidXNlcl9pZCI6IkxzNmVnSHZ3T2lPYmVxdUVzYVlrUktWTlJjajIiLCJzdWIiOiJMczZlZ0h2d09pT2JlcXVFc2FZa1JLVk5SY2oyIiwiaWF0IjoxNzM5NjAxNzEyLCJleHAiOjE3Mzk2MDUzMTIsImVtYWlsIjoia2F1c2hhbG96YThAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTIwNzc5NTUxODkzNDg2OTc3MDUiXSwiZW1haWwiOlsia2F1c2hhbG96YThAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.VTk2DoSoJarcHaWELUM7selmOYrtcdxwSuOF_URc53ZC2CQbQVgmppDLxAxO3AE5qt6DDjTHCe6eU-Rmffb3L_hN6tI4h4i9Qam2d_Ih4HtwvcC-ULUCeEDLanAVCm4-lBqs8HcUEeCKuptRqBsKxRuq5794KjHFo3LljaEavCJUjWXjr0Wm1IW6a7ePyKqrHnYTtQO4hoVnnYdmcF3XIoln_LbzeH18DOAM0oEHlXz0I7dqOKCozmdzy6WNVEVikPkZAQkgfa70wA49vWXItxndAspp_eTazXPOsEochaZyqkw-Q7shuKlJTEV86DctoT5MDo8TkseQeCKYV-NOZw",
//           "expirationTime": 1739605312972
//       },
//       "createdAt": "1739601712647",
//       "lastLoginAt": "1739601712647",
//       "apiKey": "AIzaSyBQS71huyg_3QLljm5b0rRI5W5-r9_nves",
//       "appName": "[DEFAULT]"
//   },
//   "providerId": "google.com",
//   "_tokenResponse": {
//       "federatedId": "https://accounts.google.com/112077955189348697705",
//       "providerId": "google.com",
//       "email": "kaushaloza8@gmail.com",
//       "emailVerified": true,
//       "firstName": "Kaushal",
//       "fullName": "Kaushal Oza",
//       "lastName": "Oza",
//       "photoUrl": "https://lh3.googleusercontent.com/a/ACg8ocI-IA0C6Xff7p1yTrvoXOR1TmfIjDpdZN-yTXjOOSC02Wvl_w=s96-c",
//       "localId": "Ls6egHvwOiObequEsaYkRKVNRcj2",
//       "displayName": "Kaushal Oza",
//       "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjhkMjUwZDIyYTkzODVmYzQ4NDJhYTU2YWJhZjUzZmU5NDcxNmVjNTQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiS2F1c2hhbCBPemEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSS1JQTBDNlhmZjdwMXlUcnZvWE9SMVRtZklqRHBkWk4teVRYak9PU0MwMld2bF93PXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2thdXNoYWwtYmxvZyIsImF1ZCI6ImthdXNoYWwtYmxvZyIsImF1dGhfdGltZSI6MTczOTYwMTcxMiwidXNlcl9pZCI6IkxzNmVnSHZ3T2lPYmVxdUVzYVlrUktWTlJjajIiLCJzdWIiOiJMczZlZ0h2d09pT2JlcXVFc2FZa1JLVk5SY2oyIiwiaWF0IjoxNzM5NjAxNzEyLCJleHAiOjE3Mzk2MDUzMTIsImVtYWlsIjoia2F1c2hhbG96YThAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTIwNzc5NTUxODkzNDg2OTc3MDUiXSwiZW1haWwiOlsia2F1c2hhbG96YThAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.VTk2DoSoJarcHaWELUM7selmOYrtcdxwSuOF_URc53ZC2CQbQVgmppDLxAxO3AE5qt6DDjTHCe6eU-Rmffb3L_hN6tI4h4i9Qam2d_Ih4HtwvcC-ULUCeEDLanAVCm4-lBqs8HcUEeCKuptRqBsKxRuq5794KjHFo3LljaEavCJUjWXjr0Wm1IW6a7ePyKqrHnYTtQO4hoVnnYdmcF3XIoln_LbzeH18DOAM0oEHlXz0I7dqOKCozmdzy6WNVEVikPkZAQkgfa70wA49vWXItxndAspp_eTazXPOsEochaZyqkw-Q7shuKlJTEV86DctoT5MDo8TkseQeCKYV-NOZw",
//       "context": "",
//       "oauthAccessToken": "ya29.a0AXeO80TrBOOU6Nz9Kq8BWJKJqrdcFqYTPuNQ-P2LjRec9Uq0fIQSckIjlfLV4L8cuzdGSToAxN6J2DEqR12Rpky9tpzN_TBjBHW64Uh6Uw2E9SVViqsRnzpq2TjKzgYQxN74ck_4hS1nI165alC5jaEe5JgItU16FXHPmdgoaCgYKAcESARESFQHGX2Miw6YLUpjX7nBTZgULO1ARgw0175",
//       "oauthExpireIn": 3599,
//       "refreshToken": "AMf-vBzwRME6gUtNOhuzLwDhAe_OSilZv7DPzGWIDXlV0fDslBpp0r18KgTkGP1iqL0WUywhU5_wXSyh2GqRsbm2uQOGG9yHlv6LrfE2Uv2zXxeU8iwWZm9MDiFcFgMgGnXStSFxq88fagJ8LH29QJrRjcFFr9x7JtmV6BwIiWORFGAorlRakdh2W9cOzYTguXiREEppLIV1RmXn2jAAQv5jQDxMFLOcefnqujR2wxfhrtemlpN09ldy0hP0ftOfBnM79JP7YFs8mn4BV35GfZ_Di3IT025lUL0ZZ3Scf5BhBkookPYa_F1zQRM_UFydj9c3E6Pijj-i9aoaZ0spwLid-WasFurUG3edboGwT6WMBHWLNOKhEpASOt_cKfnoYzqWwX0gskh4yZCchRsa1iMPZwnw6MUjRHv9k1CnEhogtNl-eByERQI",
//       "expiresIn": "3600",
//       "oauthIdToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImVlYzUzNGZhNWI4Y2FjYTIwMWNhOGQwZmY5NmI1NGM1NjIyMTBkMWUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiOTA3NTEzMzY0ODM0LXNlcWVsbWZrcTd2czl1NWw0MmdjamsyZmZpYWQ2bmJpLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiOTA3NTEzMzY0ODM0LXNlcWVsbWZrcTd2czl1NWw0MmdjamsyZmZpYWQ2bmJpLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTEyMDc3OTU1MTg5MzQ4Njk3NzA1IiwiZW1haWwiOiJrYXVzaGFsb3phOEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IkhBZE1FTHpkVlNTSk14eF9TZTFPeGciLCJpYXQiOjE3Mzk2MDE3MTIsImV4cCI6MTczOTYwNTMxMn0.VUkiJ1FH7EdTsjopO6UmB4ll6DwHCNC6vsvpCurOW8bWaZKLpEmgTXfLb8i3KOkihB0Sn0M-VDYu9R97Moy9IwuTZ-QtPtuO4kNTvB4MRbmIj-lYd6fTIpUOJy2HHvGW_RZ5dmZc4oBBt0EB-Roh4LCWu5OUNN_0S2qLkkcXTiOhuxH3WYvNt7RvaZ-G5d5eNkysMCXXxX4kf5v60Q2cgqH92mvb6nimA3KZxRM9RUJO3AKjbwl0nOLzQ9ra7AscZW7r4jmRova8SmfqrofTWBzaAfigNm4wh5P6N94xdg9sJszAnC5wepSw_mEmlWSpRrHktQfgQwjRiTHvOdPUlQ",
//       "rawUserInfo": "{\"name\":\"Kaushal Oza\",\"granted_scopes\":\"https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid\",\"id\":\"112077955189348697705\",\"verified_email\":true,\"given_name\":\"Kaushal\",\"family_name\":\"Oza\",\"email\":\"kaushaloza8@gmail.com\",\"picture\":\"https://lh3.googleusercontent.com/a/ACg8ocI-IA0C6Xff7p1yTrvoXOR1TmfIjDpdZN-yTXjOOSC02Wvl_w=s96-c\"}",
//       "isNewUser": true,
//       "kind": "identitytoolkit#VerifyAssertionResponse"
//   },
//   "operationType": "signIn"
// }

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleAuth = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" }); // ask each time which google account to use
    try {
      const googleResult = await signInWithPopup(auth, provider);
      //console.log(googleResult);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: googleResult.user.displayName,
          email: googleResult.user.email,
          googlePhotoURL: googleResult.user.photoURL,
        }),
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button
      type="button"
      gradientDuoTone="pinkToOrange"
      onClick={handleGoogleAuth}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2"></AiFillGoogleCircle>
      <span>Continue with google</span>
    </Button>
  );
};

export default OAuth;
