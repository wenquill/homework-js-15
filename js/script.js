'use strict';

const options = {
  results: 5,
  page: 1,
  seed: 'pe20212',
};

loadUsers(options);

function loadUsers(options) {
  fetch(
    `https://randomuser.me/api/?results=${options.results}&page=${options.page}&seed=${options.seed}`
  )
    .then(response => response.json())
    .then(({ results }) => {
      console.log('data :>> ', results);
      renderUsers(results);
    })
    .catch(e => {
      console.log('e :>> ', e);
    });
}

const [backBtn, prevBtn, nextBtn] = document.querySelectorAll('button');
const usersHolder = document.querySelector('.selected-usernames');

prevBtn.addEventListener('click', prevBtnHandler);
nextBtn.addEventListener('click', nextBtnHandler);
backBtn.addEventListener('click', backBtnHandler);

function prevBtnHandler() {
  if (options.page > 1) {
    options.page -= 1;
    loadUsers(options);
  }
}
function nextBtnHandler() {
  if (options.page < 5) {
    options.page += 1;
    loadUsers(options);
  }
}
function backBtnHandler() {
  options.page = 1;
  loadUsers(options);
}

function usersHolderHandler(e) {
  e.target.classList.toggle('user-item-color');
}

function renderUsers(users) {
  const usersList = document.querySelector('.users-list');

  const usersListItems = users.map(u => createUserItem(u));

  usersList.replaceChildren(...usersListItems);
}

function createUserItem({
  login: { username },
  name: { first: firstName, last: lastName },
  email,
  location: { city, country, state, street: {name: streetName, number: streetNumber} },
  picture: { large: src },
  dob: { age },
  gender,
}) {
  const userListItem = document.createElement('li');
  userListItem.classList.add('user-list-item');
  userListItem.addEventListener('click', usersHolderHandler);

  userListItem.append(
    createUserImg(src, `${firstName} ${lastName},`, gender),
    createUserInfo(username, firstName, lastName, email, age),
    createUserLocationBlock (city, country, state, streetName, streetNumber),
  );

  return userListItem;
}

function createUserImg(src, alt, gender) {
  const userImgEl = document.createElement('img');
  userImgEl.src = src;
  userImgEl.alt = alt;
  userImgEl.classList.add('user-img');
  userImgEl.onerror = () => {
    userImgEl.src = './imgs/defaultImg.png';
  };

  if (gender == 'male') {
    userImgEl.style = 'box-shadow: rgb(91, 93, 221) 0 0 20px;';
  } else {
    userImgEl.style = 'box-shadow: rgb(224, 119, 119) 0 0 20px;';
  }
  return userImgEl;
}

function createUserName(textContent) {
  const userMainInfoEl = document.createElement('h2');
  userMainInfoEl.textContent = textContent;
  userMainInfoEl.classList.add('name');
  return userMainInfoEl;
}

function createName(text) {
  const userNameEl = document.createElement('p');
  userNameEl.textContent = text;
  return userNameEl;
}

function createEmail (email) {
  const userEmailEl = document.createElement('a');
  userEmailEl.href = `mailto:${email}`;
  userEmailEl.textContent = email;
  userEmailEl.classList.add('user-email');
  return userEmailEl;
}

function createUserInfo (username, firstName, lastName, email, age) {
  const userInfoBlock = document.createElement('div');
  userInfoBlock.classList.add('user-info-block');
  userInfoBlock.append(
    createUserName(username),
    createName(`${firstName} ${lastName} , ${age}`),
    createEmail(email),
  );

  return userInfoBlock;
}

function createUserLocation (location) {
  const userLocationEl = document.createElement('p');
  userLocationEl.textContent = location;
  return userLocationEl;
}

function createUserStreet (street) {
  const userStreetEl = document.createElement('p');
  userStreetEl.textContent = street;
  return userStreetEl;
}

function createUserLocationBlock (city, country, state, streetName, streetNumber) {
  const userLocationBlock = document.createElement('div');
  userLocationBlock.classList.add('user-info-block');
  userLocationBlock.classList.add('user-location-block');
  userLocationBlock.append(
    createUserLocation(`${country}, ${state}, ${city}`),
    createUserStreet(`${streetName}, ${streetNumber}`),
  )

  return userLocationBlock;
}
