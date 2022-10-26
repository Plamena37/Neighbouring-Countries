"use strict";

const btn = document.querySelector(".form__btn");
const countriesContainer = document.querySelector(".countries");
const inputCountry = document.querySelector(".form__input");
const message = document.querySelector(".message");

/////////////////////////////////////////////////////////////////
const renderCountry = function (data, className = "") {
  const html = `
  <article class="country ${className}">
  <img class="country__img" src="${data.flags.png}" />
  <div class="country__data">
  <h3 class="country__name"> ${data.name.common}</h3>
  <h4 class="country__region">${data.region}</h4>
  <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(
    2
  )}M people</p>
  <p class="country__row"><span>🗣️</span>${Object.values(data.languages)[0]}</p>
  <p class="country__row"><span>🌇</span>${data.capital}</p>
  <p class="country__row"><span>💰</span>${
    Object.values(data.currencies)[0].name
  }</p>
  <p class="country__row">
    <span>🌎</span>${data.borders ? data.borders.length : 0} neighbours
  </p>
  </div>
  </article>
  `;
  countriesContainer.insertAdjacentHTML("beforeend", html);
};

/////////////////////////////////////////////////////////////////
const loadCountryAndNeighbour = async function (country) {
  try {
    clearMessage();

    //Get country
    const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    const data = await res.json();
    renderCountry(data[0]);
    countriesContainer.style.opacity = 1;

    //Get neighbour country
    const neighboursArr = data[0].borders;
    if (neighboursArr) {
      neighboursArr.forEach(async (el, i) => {
        await wait(i * 300);
        const neighbourRes = await fetch(
          `https://restcountries.com/v3.1/alpha/${el}`
        );
        const neighbourData = await neighbourRes.json();

        renderCountry(neighbourData[0], "neighbour");
      });
    } else {
      renderMessage("It is a lonely island 🏝️");
    }
  } catch (error) {
    renderMessage("Ops, something went wrong. Check your country again!");
  }
};

/////////////////////////////////////////////////////////////////
const renderMessage = function (msg) {
  message.innerHTML = msg;
  message.classList.add("message--visible");
};

/////////////////////////////////////////////////////////////////
const clearMessage = function () {
  message.innerHTML = "";
  message.classList.remove("message--visible");
};

/////////////////////////////////////////////////////////////////
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/////////////////////////////////////////////////////////////////
btn.addEventListener("click", function (event) {
  event.preventDefault();
  const countries = document.querySelectorAll(".country");
  countries.forEach((t) => t.remove());

  loadCountryAndNeighbour(`${inputCountry.value}`);
  inputCountry.value = "";
});
