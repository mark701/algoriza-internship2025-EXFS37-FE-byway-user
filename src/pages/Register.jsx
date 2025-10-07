// src/pages/Login.js
import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserServices } from '../services/UserServices';
import { authAtom } from '../utils/authAtom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import FailedRequest from '../components/FailedRequest';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    userEmail: '',
    password: '',
    confirmPassword: ''
  });

  const [socialData, setSocialData] = useState({
    UserName: '',
    UserEmail: '',
    FirstName: '',
    LastName: '',
    TypeSign: '',

  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setToken = useSetAtom(authAtom);
  const navigate = useNavigate();
  const location = useLocation();



  const from = location.state?.from?.pathname || "/";



  const responseFacebook = async (response) => {
    debugger
    if (response.accessToken) {
      console.log("Facebook login success:", response);

      const [firstName, lastName] = response.name.split(" ");
      setSocialData((prev) => ({
        ...prev,
        UserName: `${response.name}_${response.id}`,
        UserEmail: response.email,
        FirstName: firstName,
        LastName: lastName,
        TypeSign: "Facebook", // or "Facebook" etc.
      }));
      try {
        const token = await UserServices.SocialSign(socialData);

        if (token) {
          setToken(token.data);
          setSocialData({
            UserName: '',
            UserEmail: '',
            FirstName: '',
            LastName: '',
            TypeSign: '',
          });
          navigate(from, { replace: true });
        } else {
          setError('Invalid response from server - no token received');
        }
      } catch (error) {
        console.error("Facebook login error:", error);
        setError('Facebook login failed');
      }
    } else {
      setError("Facebook Login Failed");
    }
  };
  const loginWithGoogle = useGoogleLogin({

    onSuccess: async (tokenResponse) => {
      debugger
      // tokenResponse contains access_token
      console.log("Google login success:", tokenResponse);

      // You can fetch user info from Google API
      const { data: userInfo } = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        }
      );

      setSocialData((prev) => ({
        ...prev,
        UserName: `${userInfo.name}_${userInfo.sub}`,
        UserEmail: userInfo.email,
        FirstName: userInfo.given_name,
        LastName: userInfo.family_name,
        TypeSign: "GOOGLE", // or "Facebook" etc.
      }));
      try {
        const token = await UserServices.SocialSign(socialData)

        if (token) {

          setToken(token.data);
          setSocialData({
            UserName: '',
            UserEmail: '',
            FirstName: '',
            LastName: '',
            TypeSign: '',
          });
          navigate(from, { replace: true });
        } else {
          setError('Invalid response from server - no token received');
        }
      } catch (error) {
        console.error("GooGle login error:", error);
        setError('GooGle login failed');
      }

    },
    onError: () => {
      setError("Google Login Failed");
    },
  });




  const handleSubmit = async (e) => {
    debugger
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const { confirmPassword, ...payload } = formData;
      const response = await UserServices.Register(payload);
      const token = response.data;

      if (token) {

        setToken(token);
        navigate(from, { replace: true });
      } else {
        setError('Invalid response from server - no token received');
      }
    } catch (err) {
      if (err) {
        setError(err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };








  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (

    <div className="FlexScreen">
      <div className="flex-1 relative hidden lg:block">
        <img
          src={`${process.env.PUBLIC_URL}/Assets/Images/Register.png`}
          alt="Register background"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex-1 flex-center px-8 py-12 bg-white">
        <div className="w-full max-w-2xl space-y-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Create your account</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="LabelFont text-gray-900 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter First Name"
                  required
                  className="input-Rounded BorderPadding FocusBorder w-full"
                />
              </div>
              <div>
                <label className="LabelFont text-gray-900 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter Last Name"
                  required
                  className="input-Rounded BorderPadding FocusBorder w-full"
                />
              </div>
            </div>


            <div>
              <label className="LabelFont text-gray-900 mb-1">Username</label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Enter Username"
                required
                className="input-Rounded BorderPadding FocusBorder w-full"
              />
            </div>

            {/* Email */}
            <div>
              <label className="LabelFont text-gray-900 mb-1">Email</label>
              <input
                type="email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleChange}
                placeholder="Enter Email"
                required
                className="input-Rounded BorderPadding FocusBorder w-full"
              />
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="LabelFont text-gray-900 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  required
                  className="input-Rounded BorderPadding FocusBorder w-full"
                />
              </div>
              <div>
                <label className="LabelFont text-gray-900 mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Enter Confirm Password"
                  required
                  className="input-Rounded BorderPadding FocusBorder w-full"
                />
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-52 h-14  btn btn-primary"
            >
              Create Account
              <svg className="w-6 h-6" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M17 8l6 6m0 0l-6 6m6-6H3" />
              </svg>
            </button>
          </form>

          {/* Already have account */}
          <div className="text-center mt-2">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" state={{ from }} className="text-blue-600 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* Social Login */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or sign in with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <FacebookLogin
              appId={process.env.REACT_APP_FACEBOOK_APP_ID} // Replace with your Facebook App ID
              autoLoad={false}
              fields="name,email,picture"
              callback={responseFacebook}
              render={renderProps => (
                <button
                  onClick={renderProps.onClick}
                  className="btn btn-social text-blue-700 flex items-center gap-1 justify-center"
                >
                  <img src={`${process.env.PUBLIC_URL}/Assets/Icons/Facebook.png`} alt="Facebook" className="w-5 h-5" />
                  Facebook
                </button>
              )}
            />
            <button onClick={() => loginWithGoogle()} className="btn btn-social text-red-500 gap-1 flex items-center justify-center">
              <img src={`${process.env.PUBLIC_URL}/Assets/Icons/google.png`}alt="Google" className="w-5 h-5" />
              Google
            </button>
            <button
              disabled={true} className=" cursor-not-allowed btn btn-social gap-1 flex items-center justify-center">
              <img src={`${process.env.PUBLIC_URL}/Assets/Icons/Micosoft.png`} alt="Microsoft" className="w-5 h-5" />
              Microsoft
            </button>
          </div>
          <p className="text-sm text-red-500 ">
            Note: Google and Facebook buttons won’t work
            until you create a <code>.env.local</code> file
            (outside the <code>src</code> folder):
            <br />
            <code>REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id</code>
            <br />
            <code>REACT_APP_FACEBOOK_APP_ID=your_facebook_app_id</code>
          </p>

          <FailedRequest
            message={error}
            onClose={() => setError("")}
          />
        </div>
      </div>
    </div>
  );
};
export default Register;