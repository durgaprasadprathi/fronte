import axios from 'axios';

const instance = axios.create({
    baseURL:process.env.REACT_APP_API_URL,
})

instance.interceptors.request.use(request => {
    // console.log('Starting Request', request)
    return request
})
  
instance.interceptors.response.use(response => {
    // console.log('Response:', response)
    return response
})

export default instance;