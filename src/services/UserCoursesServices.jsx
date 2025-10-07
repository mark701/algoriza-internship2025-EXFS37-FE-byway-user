// src/services/AdminServices.js
import axiosInstance from '../utils/apiAxios';

export const UserCoursesServices = {


  async UserCourses(userCourse) {
    const response = await axiosInstance.post('api/UserCourses/Save', userCourse);
    return response.data;
  },
};