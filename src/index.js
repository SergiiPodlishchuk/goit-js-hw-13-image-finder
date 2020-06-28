import './styles.css';
import apiService from './js/apiService';
const debounce = require('lodash.debounce');

import imageListItem from './templates/image_List_item.hbs';
import { alert, notice, info, success, error } from '@pnotify/core';
import '@pnotify/core/dist/Material.css';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import * as basicLightbox from 'basiclightbox';

const refs = {
  galleryUl: document.querySelector('#gallery'),
  formInput: document.querySelector('#search-form'),
  btnLoadMore: document.querySelector('button[data-action="load more"]'),
};

refs.formInput.addEventListener('input', debounce(searchImages, 1000));
refs.btnLoadMore.addEventListener('click', addMoreImages);

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
    const markup = imageListItem(data.hits);
    refs.galleryUl.insertAdjacentHTML('beforeend', markup);

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
  });
}
