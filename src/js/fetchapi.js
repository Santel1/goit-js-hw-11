import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

const API_KEY = '38870428-f3c1e7b676ca79b592f9c7a41';

async function fetchImages(form, page) {
  const response = await axios.get(
    `?key=${API_KEY}&q=${form}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );

  return response.data;
}

export { fetchImages };
