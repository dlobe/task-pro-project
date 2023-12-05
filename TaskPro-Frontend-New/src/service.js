import Axios from "axios";

const url = "https://4tw9a0d6eb.execute-api.us-east-1.amazonaws.com/Stage/";
const url2 = "https://jcne38c1ij.execute-api.us-east-1.amazonaws.com/Stage/";
const urlws = "https://huv8zpnb45.execute-api.us-east-1.amazonaws.com/Stage/";
const urlc = "https://x6679zy7ue.execute-api.us-east-1.amazonaws.com/Stage/";
const urlt = "https://gxqgslrg17.execute-api.us-east-1.amazonaws.com/Stage/";
const urlm = "https://fndq0l28wh.execute-api.us-east-1.amazonaws.com/Stage/";
const appcontent = "https://im1gh0jvn9.execute-api.us-east-1.amazonaws.com/Prod/AppContent/";
const staticcontent = "https://im1gh0jvn9.execute-api.us-east-1.amazonaws.com/Prod/AppContent";
const testFunc='';

export const setToken = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  // console.log(token.idToken.jwtToken);
  if (token !== null) {
    Axios.defaults.headers.common["Authorization"] = token.idToken.jwtToken;
  }
};

setToken();
// Axios.interceptors.response.use(response => response, async error => {
//     const originalRequest = error.config;
//     if(error.response.status === 401 && !originalRequest._retry)
//     {
//         originalRequest._retry = true;
//         try{
//         const {data} = await refreshToken();
//         localStorage.setItem('token', data);
//         Axios.defaults.headers.common['Authorization'] = data.idToken.jwtToken;
//         return Axios.request(originalRequest);
//         }
//         catch(ex)
//         {
//             return Promise.reject(error);
//         }
//     }
// });

export const refreshToken = async () => {
  const token = getUser();
  if (token === null) {
    return;
  }
  const Username = token.idToken.payload.email;
  const refreshToken = token.refreshToken;
  const { data } = await Axios.put(url + "SignIn", { Username, refreshToken });
  localStorage.setItem("token", JSON.stringify(data));
  Axios.defaults.headers.common["Authorization"] = data.idToken.jwtToken;
};

export const login = async (Username, Password) => {
  const { data } = await Axios.post(url + "SignIn", { Username, Password });
  localStorage.setItem("token", JSON.stringify(data));
};

export const signup = (Username, Password) => {
  return Axios.post(url + "SignUp", { type: "SignUp", Username, Password });
};

export const confirmSignup = (Username, ConfirmationCode) => {
  return Axios.post(url + "SignUp", {
    type: "confirmSignUp",
    Username,
    ConfirmationCode,
  });
};

export const forgotPassword = (Username) => {
  return Axios.post(url + "ForgetPassword", { Username } );
};

export const setNewPassword = (Username, newPassword, verificationCode) => {
  return Axios.put(url + "ForgetPassword", {
    Username,
    newPassword,
    verificationCode,
  });
};

export const getData = () => {
  return Axios.get(testFunc );
};

export const updateData = (data) => {
  return Axios.put(testFunc, { ...data });
};

export const addOrgs = (data) => {
  return Axios.post(url2 + 'Organizations', data);
};

export const updateOrgs = (id, data) => {
  return Axios.put(url2 + 'Organizations/'+id, data);
};

export const deleteOrgs = (id) => {
  return Axios.delete(url2 + 'Organizations/'+id);
};

export const getSingleOrgs = (id) => {
  return Axios.get(url2 + 'Organizations/'+id);
};

export const getOrgs = () => {
  return Axios.get(url2 + 'Organizations');
};



export const addWorkstream = (data) => {
  return Axios.post(urlws + 'WorkStreams', data);
};

export const updateWorkstream = (id, data) => {
  return Axios.put(urlws + 'WorkStreams/'+id, data);
};

export const deleteWorkstream = (id) => {
  return Axios.delete(urlws + 'WorkStreams/'+id);
};

export const getSingleWorkStream = (id) => {
  return Axios.get(urlws + 'WorkStreams/'+id);
};

export const getWorkstream = () => {
  return Axios.get(urlws + 'WorkStreams');
};






export const addContact = (data) => {
  return Axios.post(urlc + 'Contacts', data);
};

export const updateContact = (id, data) => {
  return Axios.put(urlc + 'Contacts/'+id, data);
};

export const deleteContact = (id) => {
  return Axios.delete(urlc + 'Contacts/'+id);
};

export const getSingleContact = (id) => {
  return Axios.get(urlc + 'Contacts/'+id);
};

export const getContact = () => {
  return Axios.get(urlc + 'Contacts');
};











export const addTask = (data) => {
  return Axios.post(urlt + 'Tasks', data);
};

export const updateTask = (id, data) => {
  return Axios.put(urlt + 'Tasks/'+id, data);
};

export const deleteTask = (id) => {
  return Axios.delete(urlt + 'Tasks/'+id);
};

export const getSingleTask = (id) => {
  return Axios.get(urlt + 'Tasks/'+id);
};

export const getTask = () => {
  return Axios.get(urlt + 'Tasks');
};

export const getTasksByWorkStreamId = (workid) => {
  return Axios.get(urlt + 'Tasks?WorkStreamId='+workid);
};












export const addMeeting = (data) => {
  return Axios.post(urlm + 'Meetings', data);
};

export const updateMeeting = (id, data) => {
  return Axios.put(urlm + 'Meetings/'+id, data);
};

export const deleteMeeting = (id) => {
  return Axios.delete(urlm + 'Meetings/'+id);
};

export const getSingleMeeting = (id) => {
  return Axios.get(urlm + 'Meetings/'+id);
};

export const getMeeting = () => {
  return Axios.get(urlm + 'Meetings');
};











export const getUser = () => {
  const token = localStorage.getItem("token");
  if (token === null) {
    return null;
  }
  return JSON.parse(localStorage.getItem("token"));
};









export const getAppContent = (id) => {

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'X-Api-Key': 'oz5B1eEdrn16lyw05D7Wm8Nwpgao4hfV1QOz6PBL',
    //'Authorization': 'eyJraWQiOiJOazdNd0JqcU9DK2xGc2Vpa292cjdDN3gxMmI3aWdOVitIb2psV3FlZmY4PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJkYTQ0NmRhOS1jMTQwLTQzOWQtODU5OC01OWZlZDNlYWYyYjQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tXC91cy1lYXN0LTJfWXlWZFVnY21KIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjpmYWxzZSwiY3VzdG9tOk1lbWJlcnNoaXBUeXBlIjoiU3RhbmRhcmQiLCJjb2duaXRvOnVzZXJuYW1lIjoiZGE0NDZkYTktYzE0MC00MzlkLTg1OTgtNTlmZWQzZWFmMmI0IiwiZ2l2ZW5fbmFtZSI6IkpvZSIsImF1ZCI6IjZjNm1qOWtmNDhuNjVpZTVjNWNuZTQwcXBrIiwiY3VzdG9tOlVzZXJSb2xlIjoiU3lzdGVtQWRtaW4iLCJldmVudF9pZCI6ImE5MjM3ZDdjLTQ0MjEtNGRkMy04OTM5LTdiMDdlMzY4YWQ2NyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjE0ODQ2MDk0LCJwaG9uZV9udW1iZXIiOiIrOTIzNDQ3NTI5MjU0IiwiZXhwIjoxNjE0ODQ5Njk0LCJpYXQiOjE2MTQ4NDYwOTQsImZhbWlseV9uYW1lIjoiQmlkZW4iLCJlbWFpbCI6Im11aGFtbWVkX25hcWFzaEB5YWhvby5jb20ifQ.AqPq4AwOHu8yJiPUBEGGh7FJC03zGt4Fbl0_bnExtLbx5gijf457TAOG0JKKryyjLPwoZsPS4JGSxnzciFGs9Eb6DsoDwiEmUWFDieD7tzNuKYQHRXqBO150F_Y5q8RdOUPZVgLlW4nxCswM6aFGujx5NnuD_q-GeYrYjFjH1wf8QImj6Z3tojFDAyfKwLnI8C7NVU8nbTSBOQiBdhoNe43uhiUm9Y4AHVUZu_Nflr6sIn8hKm6OoFcIFxczY2BP-96UO_odgE8VPFQazoAOJJFtXiOpHT5dTH13BsoUyGwIH3lbpD8QOJiUL6svKxuJLyNm_JJgolcSwWT5C3ehPw'
  };
  return Axios.get(appcontent+id, { headers });
};


export const getStaticContent = () => {
  return Axios.get(staticcontent);
};



Axios.interceptors.response.use(response => response, async error => {
  const originalRequest = error.config;
  if(error.response.status === 401 && !originalRequest._retry)
  {
    localStorage.clear();
    window.location = "/login";
  }
});