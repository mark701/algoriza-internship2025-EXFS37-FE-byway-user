import axiosInstance from '../utils/apiAxios';

export const CourseServices = {

    async GetTopCourses() {
        const response = await axiosInstance.get('api/Course/GetTopCourses');
        return response.data;
    },
    async GetMaxPrice() {
        const response = await axiosInstance.get('api/Course/GetMaxPrice');
        return response.data;
    },
    async GetPagesUser(pageNumber, pageSize, filter, orderBy, ascending) {

        const response = await axiosInstance.post("api/Course/GetPagesUser", filter, // goes in body
            { params: { pageNumber, pageSize, orderBy, ascending } });
        console.log(response.data)
        return response.data;
    },
    async GetPagesAdmin(pageNumber, pageSize, criteria, category) {
        const response = await axiosInstance.get('api/Course/GetPagesAdmin', {
            params: { pageNumber, pageSize, criteria, category },
        });
        return response.data;
    },

    async GetInclude(CourseID) {
        const response = await axiosInstance.get(`api/Course/GetInclude/${CourseID}`);
        return response.data;
    },
}