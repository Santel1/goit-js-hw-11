import { fetchImages } from './fetchapi';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;
let totalHits = 0;

// loadMoreBtn.classList.add('.js-load-more');
// loadMoreBtn.classList.remove('.js-load-more');

// loadMoreBtn.style.display = 'none';

form.addEventListener('submit', event => {
  event.preventDefault();
  const searchQueryInput = form.querySelector('input[name="searchQuery"]');
  const searchQuery = searchQueryInput.value;

  if (searchQuery === '') {
    Notiflix.Notify.failure('Please fill in the input field.');
    return;
  }

  fetchImages(searchQuery)
    .then(resp => {
      loadMoreBtn.classList.remove('js-load-more');
      totalHits = resp.totalHits;

      if (resp.hits.length === 0) {
        loadMoreBtn.classList.add('js-load-more');
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        gallery.innerHTML = '';
        return;
      }
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);

      const showLoadMoreBtn =
        totalHits <= 40
          ? loadMoreBtn.classList.add('js-load-more')
          : loadMoreBtn.classList.remove('js-load-more');

      gallery.innerHTML = createMurkupImageGallery(resp);

      const galleryCard = new SimpleLightbox('.gallery a', {
        captions: true,
        captionsData: 'alt',
        captionDelay: 250,
      });
    })
    .catch(err => console.error(err));
});

loadMoreBtn.addEventListener('click', evt => {
  const searchQueryInput = form.querySelector('input[name="searchQuery"]');
  const searchQuery = searchQueryInput.value;
  page += 1;
  fetchImages(searchQuery, page)
    .then(resp => {
      if (resp.hits.length === 0) {
        loadMoreBtn.classList.add('js-load-more'); // Если нет данных, скрываем кнопку
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        return;
      }

      // Добавляем данные на страницу
      gallery.insertAdjacentHTML('beforeend', createMurkupImageGallery(resp));

      // Если количество загруженных данных равно общему числу изображений,
      // значит пользователь дошел до конца коллекции
      if (page * 40 >= totalHits) {
        loadMoreBtn.classList.add('js-load-more'); // Скрываем кнопку
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 3,
        behavior: 'smooth',
      });
    })
    .catch(err => console.error(err));
});

function createMurkupImageGallery(data) {
  return data.hits
    .map(
      data =>
        `
<div class="photo-card">
 <a href="${data.largeImageURL}">
    <img src="${data.webformatURL}" alt="${data.tags}" loading="lazy" class="image-gallery"/>
 </a>
    <div class="info">
      <p class="info-item">
        Likes:<br>${data.likes}</br>
      </p>
      <p class="info-item">
        Views:<br>${data.views}</br>
      </p>
      <p class="info-item">
        Comments:<br>${data.comments}</br>
      </p>
      <p class="info-item">
        Downloads:<br>${data.downloads}</br>
      </p>
    </div>
</div>
    `
    )
    .join('');
}