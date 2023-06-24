import Api from './api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const picsApi = new Api();

const form = document.querySelector('.search-form');
const input = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-button');
const moreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', onSearchClick);
moreBtn.addEventListener('click', onMoreClick);
gallery.addEventListener('click', onTestClick);

function onTestClick(e) {
    e.preventDefault();
}


async function onSearchClick(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  picsApi.page=1;
  moreBtn.classList.add('is-hidden');

  picsApi.query = event.currentTarget.elements.searchQuery.value.trim();

  if (!picsApi.query) {
    Notify.warning('Type something, please!');
    return;
  }

  const data = await picsApi.fetchQuery();

  if (data.totalHits === 0) {
    Notify.failure(
      'No images matching your request, sorry!'
    );
    return;
  }
  Notify.success(`${data.totalHits} images were found`);

  renderCard(data);
  moreBtn.classList.remove('is-hidden');

    checkEndReach();

}

function renderCard(data) {
    const cardsArray = [];

  data.hits.forEach(item => {
    const card = document.createElement('div');
    card.className = 'photo-card';

    card.innerHTML = `<a href="${item.webformatURL}"><img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" /></a>
    <div class="info">
      <p class="info-item">
        Views <br/><b>${item.views}</b>
      </p>
      <p class="info-item">
        Downloads <br/><b>${item.downloads}</b>
      </p>
      <p class="info-item">
        Likes <br/><b>${item.likes}</b>
      </p>
      <p class="info-item">
        Comments <br/><b>${item.comments}</b>
      </p>
    </div>`;

      cardsArray.push(card);
  });
    gallery.append(...cardsArray);
    lightbox.refresh();
}

async function onMoreClick() {
  const data = await picsApi.fetchQuery();
  renderCard(data);
  checkEndReach();
}

function checkEndReach() {
  if (picsApi.total <= 39 * (picsApi.page - 1)) {
    moreBtn.classList.add('is-hidden');

    Notify.warning(
      `You have reached the end of search results.`
    );
  }
}

    const lightbox = new SimpleLightbox(".gallery a", {
  captionsData: "alt",
  captionsDelay: 250,
  disableScroll: false,
});
lightbox.on('show.simplelightbox', function (event) {
    event.preventDefault();
    console.log("click");
});

