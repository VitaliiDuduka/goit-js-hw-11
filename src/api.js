
const axios = require('axios').default;

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '37780735-65f99d8f5cca5af3b0b1b32c8';


export default class PicsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.total = 0;
  }

  async fetchQuery() {
    try {
      const response = await axios.get(
        `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&per_page=39&page=${this.page}&image_type=photo&orientation=horizontal&safesearch=true`
      );

      const data = response.data;
      this.total = data.totalHits;
      this.page +=1;

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

}