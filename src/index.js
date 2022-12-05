import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchQuery: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

let inputValue = '';

refs.searchQuery.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
  evt.preventDefault();

  inputValue = refs.searchQuery.value.trim();

  if (inputValue === '') {
    clearRender();
    return;
  }

  fetchCountries(inputValue)
    .then(countries => {
      if (countries.length === 1) {
        clearRender();
        renderCountryTitle(countries);
        renderCountryInfo(countries);
      }
      if (countries.length >= 2 && countries.length <= 10) {
        clearRender();
        renderCountryTitle(countries);
      }
      if (countries.length > 10) {
        clearRender();
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(catchError);
}

function renderCountryTitle(countries) {
  const markup = countries
    .map(country => {
      return `<li class="country-item">
      <img class='country-img' src="${country.flags.svg}" alt="flag">
      <p>${country.name.official}</p>
    </li>`;
    })
    .join('');

  refs.countryList.insertAdjacentHTML('beforeend', markup);
}

function renderCountryInfo(countries) {
  const langs = countries.map(({ languages }) =>
    Object.values(languages).join(', ')
  );

  const markup = countries
    .map(country => {
      return `<p>Capital: <span >${country.capital}</span></p>
      <p>Population: <span >${country.population}</span></p>
      <p>languages: <span >${langs}</span></p>`;
    })
    .join('');

  refs.countryInfo.insertAdjacentHTML('beforeend', markup);
}

function clearRender() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}

function catchError() {
  clearRender();

  Notiflix.Notify.failure('Oops, there is no country with that name :(');
}
