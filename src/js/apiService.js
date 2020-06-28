const baseUrl = 'https://pixabay.com/api/';
const imageType = '?image_type=photo&orientation=horizontal&';

export default {
  page: 1,
  query: '',
  fetchAPI() {
    const options = {
      headers: {
        Authorization: '17198919-7cedd3f99d379df98db4093df',
      },
    };
    const inputText = `q=${this.query}&page=${this.page}&per_page=12&key=17198919-7cedd3f99d379df98db4093df`;

    return fetch(baseUrl + imageType + inputText, this.options).then(
      response => {
        this.page += 1;
        return response.json();
      },
    );
  },
  get searchImage() {
    return this.query;
  },
  set searchImage(value) {
    this.query = value;
  },
  resetPage() {
    this.page = 1;
  },
};
