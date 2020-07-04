import './styles.css';
import * as basicLightbox from 'basiclightbox';
import apiService from './js/apiService';
const debounce = require('lodash.debounce');

import imageListItem from './templates/image_List_item.hbs';
import { alert, notice, info, success, error } from '@pnotify/core';
import '@pnotify/core/dist/Material.css';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import InfiniteScroll from 'infinite-scroll';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';

const refs = {
  galleryUl: document.querySelector('#gallery'),
  formInput: document.querySelector('#search-form'),
  btnLoadMore: document.querySelector('button[data-action="load more"]'),
};

refs.formInput.addEventListener('input', debounce(searchImages, 1000));
refs.btnLoadMore.addEventListener('click', addMoreImages);
refs.galleryUl.addEventListener('click', bigImage);

function searchImages(e) {
  e.preventDefault();
  const input = e.target.value;

  if (input === '') {
    const myAlert = alert({
      text: `Please enter something.`,
      type: 'info',
      delay: 5000,
      closer: true,
    });
    refs.galleryUl.innerHTML = '';
    return;
  }

  apiService.resetPage();
  apiService.searchImage = input;
  apiService.fetchAPI().then(data => {
    if (data.hits.length === 0) {
      const myAlert = alert({
        text: `Your search did not match.`,
        type: 'info',
        delay: 5000,
        closer: true,
      });
      refs.galleryUl.innerHTML = '';
      return;
    }

    const markup = imageListItem(data.hits);
    refs.galleryUl.insertAdjacentHTML('beforeend', markup);
    masonry();
  });

  refs.galleryUl.innerHTML = '';
}

function addMoreImages() {
  window.scrollTo({
    top: refs.galleryUl.offsetHeight,
    left: 0,
    behavior: 'smooth',
  });
  apiService.fetchAPI().then(data => {
    const markup = imageListItem(data.hits);
    refs.galleryUl.insertAdjacentHTML('beforeend', markup);

    masonry();
  });
}

function bigImage(e) {
  const imageSrc = e.target.getAttribute('srcset');
  const instance = basicLightbox.create(`<img width="1200" src="${imageSrc}">`);

  const visible = basicLightbox.visible();
  const img = document.querySelector('.basicLightbox');
  console.log(e.target);

  instance.show();

  window.scrollTo({
    top: refs.galleryUl.offsetHeight,
    left: 0,
    behavior: 'smooth',
  });
}

function masonry() {
  imagesLoaded('#gallery', function () {
    const masonryInstance = new Masonry('#gallery', {
      columnWidth: 350,
      itemSelector: '.grid-item',
      gutter: 5,
      // percentPosition: true,
      transitionDuration: '4s',
    });
  });
}

// const infScroll = new InfiniteScroll(refs.galleryUl, {
//   path() {
//     const options = {
//       headers: {
//         Authorization: '17198919-7cedd3f99d379df98db4093df',
//       },
//     };
//     return `https://pixabay.com/api/?q=cat&image_type=photo&orientation=horizontal&page=${this.pageIndex}&per_page=12&key=17198919-7cedd3f99d379df98db4093df`;
//   },
//   append: '.post',
//   history: false,
//   responseType: 'text',
// });

// console.log(infScroll);

// infScroll.on('load', (response, url) => {
//   const images = JSON.parse(response);
//   const markup = images.map(image => imageListItem(image).join(''));
//   const proxyEl = document.createElement('div');
//   proxyEl.innerHTML = markup;
//   const parsedImages = proxyEl.querySelectorAll('.');
//   infScroll.appendItems(parsedImages);
// });

// infScroll.loadNextPage();
