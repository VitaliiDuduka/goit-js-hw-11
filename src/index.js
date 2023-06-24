import Api from './api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const picsApiService = new Api();

const form = document.querySelector('.search-form');
const input = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-button');
const moreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', onSearchClick);
moreBtn.addEventListener('click', onMoreClick);

async function onSearchClick(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  picsApiService.page=1;
  moreBtn.classList.add('is-hidden');

  picsApiService.query = event.currentTarget.elements.searchQuery.value.trim();

  if (!picsApiService.query) {
    Notify.warning('Type something, please!');
    return;
  }

  const data = await picsApiService.fetchQuery();

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

    card.innerHTML = `<img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
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
}

async function onMoreClick() {
  const data = await picsApiService.fetchQuery();
  renderCard(data);
  checkEndReach();
}

function checkEndReach() {
  if (picsApiService.total <= 39 * (picsApiService.page - 1)) {
    moreBtn.classList.add('is-hidden');

    Notify.warning(
      `You have reached the end of search results.`
    );
  }
}
