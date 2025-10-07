// src/pages/Login.js
import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserServices } from '../services/UserServices';
import { authAtom } from '../utils/authAtom';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import FailedRequest from '../components/FailedRequest'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

const Login = () => {
  const [formData, setFormData] = useState({
    EmailOrName: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setToken = useSetAtom(authAtom);
  const navigate = useNavigate();
  const location = useLocation();



  const from = location.state?.from?.pathname || location.state?.from || "/";


  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);
    setError('');

    debugger
    try {
      // This will send the exact JSON format you specified
      const response = await UserServices.login(formData);
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



  const responseFacebook = async (response) => {
    debugger
    if (response.accessToken) {
      console.log("Facebook login success:", response);

      const [firstName, lastName] = response.name.split(" ");

      // Create the data object directly
      const userData = {
        UserName: `${response.name}_${response.id}`,
        UserEmail: response.email,
        FirstName: firstName,
        LastName: lastName || '',
        TypeSign: "Facebook",
      };

      try {
        // Use userData directly instead of socialData state
        const token = await UserServices.SocialSign(userData);

        if (token) {
          setToken(token.data);
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


      const userData = {
        UserName: `${userInfo.name}_${userInfo.sub}`,
        UserEmail: userInfo.email,
        FirstName: userInfo.given_name,
        LastName: userInfo.family_name,
        TypeSign: "GOOGLE",
      };
      try {
        const token = await UserServices.SocialSign(userData)

        if (token) {

          setToken(token.data);

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



  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (

    <div className="FlexScreen">
      <div className="flex-1 flex-center px-8 py-12 bg-white">
        <div className="w-full max-w-2xl space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Sign in to your account
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="EmailOrName" className="LabelFont text-gray-900 mb-2">
                Email or Username
              </label>
              <input
                id="EmailOrName"
                name="EmailOrName"
                type="text"
                value={formData.EmailOrName}
                onChange={handleChange}
                placeholder="Enter your email or username"
                disabled={loading}
                required
                className="input-Rounded BorderPadding FocusBorder"
              />
            </div>

            <div>
              <label htmlFor="password" className="LabelFont text-gray-900 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={loading}
                required
                className="input-Rounded BorderPadding FocusBorder "
              />
            </div>

            <button type="submit" disabled={loading} className="w-32 h-14 btn btn-primary">
              Sign In
              <svg className="w-6 h-10" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M17 8l6 6m0 0l-6 6m6-6H3" />
              </svg>
            </button>
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don’t have an account?{' '}
                <Link
                  to="/register"
                  state={{ from }}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Create one
                </Link>
              </p>
            </div>

          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or sign in with</span>
            </div>
          </div>


          <div className="grid grid-cols-3 gap-3">
            <FacebookLogin
              appId={process.env.REACT_APP_FACEBOOK_APP_ID}
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

            <button
              onClick={() => loginWithGoogle()}
              className="btn btn-social text-red-500 gap-1"
            >
              <img src={`${process.env.PUBLIC_URL}/Assets/Icons/google.png`} alt="Google" className="w-5 h-5" />
              Google
            </button>



            <button
              disabled={true}
              className="btn btn-social cursor-not-allowed">
              <img src={`${process.env.PUBLIC_URL}/Assets/Icons/Micosoft.png`} alt="Micosoft" className="w-5 h-5" />Micosoft</button>
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
        </div>
      </div>

      <div className="flex-1  relative hidden lg:block">
        <img src={`${process.env.PUBLIC_URL}/Assets/Images/SignImage.png`} alt="Login background" className="h-full w-full object-cover" />
      </div>

      <FailedRequest
        message={error}
        onClose={() => setError("")}
      />
    </div>
  );
};

export default Login;