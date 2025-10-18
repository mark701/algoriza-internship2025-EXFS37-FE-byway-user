// src/services/UserServices.js
import axiosInstance from '../utils/apiAxios';

export const UserServices = {
  async login(UserData) {
    const response = await axiosInstance.post('api/User/Login', UserData);
    return response;
  },

  async Register(UserData) {
    const response = await axiosInstance.post('api/User/Register', UserData);
    return response;
  },
    SocialSign: async (SocialData) => {
    // Send Google credential token to your backend
    const response= await axiosInstance.post('api/User/SocialSign', SocialData);
    return response;
  },

      UserSearch: async (Search) => {
    const response= await axiosInstance.get(`api/User/UserSearch/${Search}`);
    return response.data;
  },
};