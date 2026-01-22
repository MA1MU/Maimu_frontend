import axios from 'axios';

// axios 기본 설정: 모든 요청에서 쿠키를 포함하도록 설정
axios.defaults.withCredentials = true;

const api ={
    // baseUrl: "http://ec2-52-79-129-227.ap-northeast-2.compute.amazonaws.com:8080",
    baseUrl: "http://localhost:8080",
};

export default api;