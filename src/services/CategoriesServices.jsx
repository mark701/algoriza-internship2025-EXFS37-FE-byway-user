import axiosInstance from '../utils/apiAxios';

export const CategoriesServices = {
    async categoryCourseCounts() {
        const response = await axiosInstance.get('api/category/categoryCourseCounts');
        return response.data;
    },

    async GetNameID() {
        const response = await axiosInstance.get('api/category/GetNameID');
        return response.data;
    },

};