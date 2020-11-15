const form = document.querySelector('.search__form');
const searchBtn = document.querySelector('.button--search');

form.classList.add('search__form--hide');

searchBtn.addEventListener('click', (evt) => {
  evt.preventDefault();

  if (form.classList.contains('search__form--hide')) {
    form.classList.remove('search__form--hide');
    form.classList.add('search__form--show');
  } else {
    form.classList.toggle('search__form--close');
    form.classList.toggle('search__form--show');
  }
});
