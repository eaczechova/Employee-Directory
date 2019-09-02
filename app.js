const containerElement = document.querySelector('.container');
const url = 'https://randomuser.me/api/?results=12&nat=us';
const input = document.getElementById('employee-search');

// ------------------------------------------
//  FETCH FUNCTION
// ------------------------------------------

fetch(url)
  .then(response => response.json())
  .then(data => {
    generateEmployeeCard(data);
    filterEmployees();
  })
  .catch(error => console.log('error is', error));

function generateEmployeeCard(data) {

  let listOfEmployees = data.results;
  let userInput = null;
  let modal;

  // The program maps over results returned from the fetch request
  // and creates employee cards (with modal)

  listOfEmployees.map( (item, index) => {

    let employeeElement = document.createElement("div");

    let date = item.dob.date.slice(0, 10).replace(/-/g,"/");
    let firstName = item.name.first.charAt(0).toUpperCase() + item.name.first.slice(1);
    let lastName = item.name.last.charAt(0).toUpperCase() + item.name.last.slice(1);
    let city = item.location.city.charAt(0).toUpperCase() + item.location.city.slice(1);

    employeeElement.classList.add("employee");
    employeeElement.setAttribute('data-index', `${index+1}`);

    employeeElement.innerHTML = `<img src="${item.picture.large}" alt="" class="employee__photo" data-index= ${index+1}>
    <ul data-index = ${index+1}>
      <li class="employer__name" data-index = ${index+1}>${firstName} ${lastName} </li>
      <li class="employer__mail" data-index = ${index+1}>${item.email}</li>
      <li class="employer__location" data-index = ${index+1}>${city}</li>
    </ul>
    `;

    modal = document.createElement("div");
    modal.classList.add("modal");
    modal.setAttribute('data-index', `${index+1}`);
    modal.style.display = 'none';
    modal.innerHTML = `
      <div class="arrow-left" data-index = ${index+1}>&lt;</div><div class="modal-content" data-index = ${index+1} >
        <div>
          <span class="close-modal">X</span>
        </div>

        <img src="${item.picture.large}" alt="" class="modal__photo">
        <ul>
          <li class="modal__name">${firstName} ${lastName}</li>
          <li class="modal__mail">${item.email}</li>
          <li class="modal__location">${city}</li>
          <hr/>
          <li class="modal__phone">${item.phone}</li>
          <li class="modal__address">${item.location.street} ${item.location.postcode}</li>
          <li class="modal__birthday">Birthday: ${date}</li>
        </ul>

      </div><div class="arrow-right" data-index = ${index+1}>&gt;</div>
    `;
    employeeElement.appendChild(modal);
    containerElement.appendChild(employeeElement);

  });

  // The program loops over modal elements and opens modal
  // matching index of the clicked element

  containerElement.addEventListener('click', function(e) {
    let index = e.target.getAttribute('data-index');
    const modalsCollection = document.querySelectorAll('.modal');

    for(let i = 0; i < modalsCollection.length; i++) {

      if(modalsCollection[i].getAttribute('data-index') === index) {
        modalsCollection[i].style.display = 'flex';
      } else {
        modalsCollection[i].style.display = 'none';
      }
    }});


  // The program loops over modal elements and adds event listner on click event;
  // that either closes modal or moves it back/forward

  const modalsCollection = document.querySelectorAll('.modal');

  for(let i = 0 ; i < modalsCollection.length; i++) {
    modalsCollection[i].addEventListener('click', function(e) {
      let index = e.target.getAttribute('data-index');
      if(e.target.nodeName === 'SPAN') {
        modalsCollection[i].style.display = 'none';
      } else if (e.target.classList.contains('arrow-left')) {
        e.stopPropagation();
        modalsCollection[i].style.display = 'none';
        modalsCollection[i-1].style.display = 'flex';
      } else if (e.target.classList.contains('arrow-right')) {
        e.stopPropagation();
        modalsCollection[i].style.display = 'none';
        modalsCollection[i+1].style.display = 'flex';
      }
    });
  }
};

// ------------------------------------------
//  FILTER FUNCTION
// ------------------------------------------

function filterEmployees() {
  const employeeCards = document.querySelectorAll('.employee > ul');
  input.addEventListener('keyup', function(e) {
    let searchInput = e.target.value.toLowerCase();
    employeeCards.forEach(function(item) {

      let employeeDataCheck = item.children[0].textContent.toLowerCase();

      if(employeeDataCheck.indexOf(searchInput) > -1) {
        item.parentNode.style.display="flex";
      } else {
        item.parentNode.style.display="none";
      }
    });
  });
}

generateEmployeeCard(url);
