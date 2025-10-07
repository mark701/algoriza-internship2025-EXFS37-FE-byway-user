import axiosInstance from '../utils/apiAxios';

export const InstructorServices = {
    async GetTopInstructors() {
        const response = await axiosInstance.get('api/instructor/GetTopInstructors');
        return response.data;
    },



};