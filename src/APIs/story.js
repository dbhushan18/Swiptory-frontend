import axios from "axios"
const Backend_url = import.meta.env.VITE_BACKEND_URL

export async function CreateStory({ userId, slides }) {
  try {
    const reqUrl = `${Backend_url}/story/create`
    const reqParams = { userId, slides };
    const response = await axios.post(reqUrl, reqParams)
    return response.data;
  }
  catch (err) {
    console.log(err);
  }
}

export async function GetStory({ category }) {
  try {
    const reqUrl = `${Backend_url}/story/getstory`
    const reqParams = { category };
    const response = await axios.post(reqUrl, reqParams)
    return response.data;
  }
  catch (err) {
    console.log(err);
  }
}

export async function getUserStories(userId) {
  try {
    const reqUrl = `${Backend_url}/story/getUserStories?userId=${userId}`;
    const response = await axios.get(reqUrl);
    return response.data;
  } catch (err) {
    console.log(err);
  }
}


export async function fetchBookmarkStatus(slideId) {
  try {
    const reqUrl = `${Backend_url}/story/isBookmarked/${slideId}`
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    const response = await axios.get(reqUrl)
    return response.data;
  } catch (err) {
    console.error(err);
  }
}

export async function updateBookmarkStatus(endpoint, slideId) {
  try {
    const reqUrl = `${Backend_url}/story/${endpoint}`
    const reqParams = { slideId };
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    const response = await axios.post(reqUrl, reqParams);
    return response.data;
  } catch (err) {
    console.error(err);
  }
}

export async function updateLikeStatus(slideId) {
  try {
    const reqUrl = `${Backend_url}/story/like`
    const reqParams = { slideId };
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    const response = await axios.post(reqUrl, reqParams);
    return response.data;
  } catch (err) {
    console.error(err);
  }
}

export async function getLikeData(slideId) {
  try {
    const reqUrl = `${Backend_url}/story/likeData/${slideId}`
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    const response = await axios.get(reqUrl)
    return response.data;
  } catch (err) {
    console.error(err);
  }
}

export async function getSharedStory(slideId) {
  try {
    const reqUrl = `${Backend_url}/story/viewstory/${slideId}`
    const response = await axios.get(reqUrl)
    return response.data;
  }
  catch (err) {
    console.log(err);
  }
}

export async function UpdateStory(storyId, storyData) {
  try {
    const reqUrl = `${Backend_url}/story/${storyId}`
    const response = await axios.put(reqUrl, storyData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getBookmarks(userId) {
  try {
    const reqUrl = `${Backend_url}/story/bookmarks?userId=${userId}`
    const response = await axios.get(reqUrl)
    return response.data;
  }
  catch (err) {
    console.log(err);
  }
}
