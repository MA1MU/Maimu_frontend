import axios from 'axios';

const api = {
    // baseUrl: "http://ec2-52-79-129-227.ap-northeast-2.compute.amazonaws.com:8080",
    baseUrl: "https://apimaimu.co.kr",
};

// axios 기본 설정: 모든 요청에서 쿠키를 포함하도록 설정
axios.defaults.withCredentials = true;

// Response Interceptor: 모든 axios 요청에서 T-003 에러 발생 시 토큰 재발급 후 재시도
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // 에러 응답이 있고, 에러 코드가 "T-003"인 경우 (이미 만료된 토큰)
        if (error.response && error.response.data && error.response.data.code === 'T-003' && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                console.log('Access token expired. Attempting to reissue globally...');

                // 토큰 재발급 요청
                const response = await axios.post(`${api.baseUrl}/v1/api/auth/reissue`, {}, {
                    withCredentials: true
                });

                if (response.status === 200) {
                    const newAccessToken = response.data.accessToken;
                    console.log('Token reissued successfully.');

                    // 새 토큰 저장
                    localStorage.setItem('access_token', newAccessToken);

                    // 실패했던 이전 요청의 헤더를 새 토큰으로 교체하고 다시 시도
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    
                    // baseURL이 이미 붙어있는 경우 등을 고려하여 원래 설정을 그대로 사용해 재요청
                    return axios(originalRequest);
                }
            } catch (reissueError) {
                console.error('Failed to reissue token:', reissueError);
                localStorage.removeItem('access_token');
                // 필요 시 로그인 페이지로 이동 (예: window.location.href = '/')
                return Promise.reject(reissueError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
