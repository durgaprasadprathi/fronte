import axios from '../../shared/axios-details';
import  store  from '../../store';

const errorMessage = "Something went wrong. Please try again";
const errorObject = {
    status: false,
    message: errorMessage
};

const getToken = () =>{
    // let auth = store.getState();
    let token = localStorage.getItem("authUser");
    if(token) {
        token = JSON.parse(token);
        // console.log(token);
        return token.data.jwt;
    }
}

export const getAPI = async(url) =>{
    let token = getToken();
    let data;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    // console.log(config)
    await axios.get(url, config)
    .then(res => {
        // console.log(res)
        data =res.data
    })
    .catch(err =>{
        console.error(err)
        data = errorObject;
    })

    return data;
}

export const putAPI = async(url, postData) =>{
    let token = getToken();
    let data;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    // console.log(config);

    postData = {
        ...postData
    }

    await axios.put(url,postData,  config)
    .then(res => {
        // console.log(res)
        data =res.data
    })
    .catch(err =>{
        console.error(err)
        data = errorObject;
    })

    return data;
}

export const deleteAPI = async(url) =>{
    let token = getToken();
    let data;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    // console.log(config)
    await axios.delete(url, config)
    .then(res => {
        // console.log(res)
        data =res.data
    })
    .catch(err =>{
        console.error(err)
        data = errorObject;
    })

    return data;
}

export const postAPINoToken = async(url, postData) =>{
    
    let data;

    const config = {
        
    };

    postData = {
        ...postData
    }
   
    await axios.post(url, postData, config)
    .then(res => {
        // console.log(res.data);
        if(res.data && res.data.status === "success"){
            data = {
                ...res.data,
                status:true,
            }
        }
        else{ 
            data = {
                ...res.data,
                status:false,
            }
        }
        
    })
    .catch(err =>{
        console.error(err)
        data = errorObject;
    })

    return data;
}



export const postAPI = async(url, postData) =>{
    let token = getToken();
    let data;

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    postData = {
        ...postData
    }
   
    await axios.post(url, postData, config)
    .then(res => {
        data = res.data;
    })
    .catch(err =>{
        console.error(err)
        data = errorObject;
    })

    return data;
}


export const postFormDataAPI = async(url, postData) =>{
    let token = getToken();
    let data;

    const config = {     
        headers: { 'content-type': 'multipart/form-data',
        Authorization: `Bearer ${token}` }
    }
   
    await axios.post(url, postData, config)
    .then(res => {
        data = res.data;
    })
    .catch(err =>{
        console.error(err)
        data = errorObject;
    })

    return data;
}