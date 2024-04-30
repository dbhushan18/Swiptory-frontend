import axios from "axios"
const Backend_url = import.meta.env.VITE_BACKEND_URL

export async function RegisterUser({ username, password}) {
  try {
    const reqUrl = `${Backend_url}/auth/register`
    const reqParams = { username, password };
    const response = await axios.post(reqUrl, reqParams)
    return response.data;
  }
  catch (err) {
    console.log(err);
  }
}

export async function LoginUser({ username, password }) {
  try {
    const reqUrl = `${Backend_url}/auth/login`
    const reqParams = { username, password };
    const response = await axios.post(reqUrl, reqParams)
    return response.data;
  }
  catch (err) {
    console.log(err);
  }
}


