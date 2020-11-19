'use strict';

const form = document.querySelector('.search__form');
const searchBtn = document.querySelector('.button--search');
const toggleMin = document.querySelector('.filter__togglel--min');
const toggleMax = document.querySelector('.filter__togglel--max');
const hotelsSearchEl = document.querySelector('.hotels-search');
const barEl = document.querySelector('.filter__bar');
const fieldMinValue = document.querySelector('#min-price-value');
const fieldMaxValue = document.querySelector('#max-price-value');

const minBarValue = 0;
const toggleWidth = toggleMax.offsetWidth;
const maxBarValue = barEl.offsetWidth - toggleWidth;
const ratio =  fieldMaxValue.max  / maxBarValue;

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

if (form) {
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
}

function onToggleMinClick(evt) {
  evt.preventDefault();
  const toggle = evt.target;

  let startCoords = {
    x: evt.clientX,
  };

  function onToggleMouseMove(mouseEvt) {
    mouseEvt.preventDefault();

    let shift = {
      x: startCoords.x - mouseEvt.clientX,
    };

    startCoords = {
      x: mouseEvt.clientX,
    };

    let toggleY = toggle.offsetLeft - shift.x;

    if ((toggleY >= minBarValue && toggleY <=  maxBarValue) ) {
      if ((toggle === toggleMin) && toggleY < (toggleMax.offsetLeft - toggleWidth)) {
        toggle.style.left = `${toggleY}px`;
        updateBar(toggleY);
        fieldMinValue.value = Math.round(toggleY * ratio);
      }
      if ((toggle === toggleMax) && toggleY > (toggleMin.offsetLeft + toggleWidth)) {
        toggle.style.left = `${toggleY}px`;
        updateBar(toggleMin.offsetLeft);
        fieldMaxValue.value = Math.round(toggleY  * ratio);
      }
    }
  }

  let onToggleMouseUp = function (upEvt) {
    upEvt.preventDefault();

    hotelsSearchEl.removeEventListener('mousemove', onToggleMouseMove);
    hotelsSearchEl.removeEventListener('mouseup', onToggleMouseUp);
  };

  hotelsSearchEl.addEventListener('mousemove', onToggleMouseMove);
  hotelsSearchEl.addEventListener('mouseup', onToggleMouseUp);
};

let onChangeToggleMin = debounce(function (evt)  {
  const fieldEl = evt.target;
  const currentToggleValue = toggleMax.offsetLeft * ratio;
  const minValue = parseInt(fieldMinValue.min);

  if ((fieldEl.value >= minValue) && (fieldEl.value <= currentToggleValue - toggleWidth * ratio)) {
    toggleMin.style.left = `${fieldEl.value / ratio}px`;
    updateBar(fieldEl.value / ratio);
  } else if ( fieldEl.value <= currentToggleValue) {
    toggleMin.style.left = `${toggleMax.offsetLeft - toggleWidth}px`;
    updateBar(fieldEl.value / ratio);
  }
}, 500);

let onChangeToggleMax = debounce(function (evt)  {
  const fieldEl = evt.target;
  const currentToggleValue = toggleMin.offsetLeft * ratio;
  const maxValue = parseInt(fieldMaxValue.max);

  if ((fieldEl.value <= maxValue) && (fieldEl.value >= currentToggleValue + toggleWidth * ratio)) {
    toggleMax.style.left = `${fieldEl.value / ratio}px`;
    updateBar(toggleMin.offsetLeft);
  } else if (fieldEl.value >= currentToggleValue && fieldEl.value <= maxValue) {
    toggleMax.style.left = `${toggleMin.offsetLeft + toggleWidth}px`;
    updateBar(toggleMin.offsetLeft);
  }
}, 500);


function updateBar(leftCoordinate) {
  barEl.style.cssText = `left: ${leftCoordinate}px; width: ${toggleMax.offsetLeft - toggleMin.offsetLeft}px`;
}

toggleMin.addEventListener('mousedown', onToggleMinClick);
toggleMax.addEventListener('mousedown', onToggleMinClick);

fieldMinValue.addEventListener('keyup', onChangeToggleMin);
fieldMaxValue.addEventListener('keyup', onChangeToggleMax);
