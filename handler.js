document.getElementById('title').innerText = `NASA Image Search`;
document.getElementById('searchInput').placeholder= `Type here to search...`;
document.getElementById('searchButton').value = `Go!`;

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const content = document.getElementById('content');
const historySec = document.getElementById('history');

searchInput.setAttribute('autocomplete', 'on');


var apikey = '1Cw8VOttiF5XBtwxBzveMKlsGQdQ5sn3gsHuZGYO';




function search(query = "apollo") {
  let url =
  `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`;
  fetch(url)
    .then((response) => {
        if(!response.ok) throw Error("Failed to retrieve images");
        return response.json();
    })
    .then((obj) => {populate(obj.collection);})
    .catch((error) => {
      console.log(error);
    });
}

function populate (collection) {
  content.innerText = "";
  let {links, items} = collection;
  let b = document.createElement('br');
  b.setAttribute('clear', 'all');
  b.innerText = ' ';

  for(let i = 0; i < items.length; i++) {
    var {center, date_created, description, location, title} = items[i].data[0];
    var info = `Title: ${title}
    Location: ${location}
    Date Created: ${date_created}
    Description: ${description}`;

    var imgsrc = items[i].links[0].href;

    var imageContainer = document.createElement('div');

    imageContainer.setAttribute("class", "imageContainer");
    imageContainer.setAttribute("style", `background: url('${imgsrc}') no-repeat center center / cover ;`);
    imageContainer.setAttribute('id', i);

    imageContainer.addEventListener('mouseover', function () {
      this.style.color = "rgba(255, 255, 255, 1.0)";
      this.style.textShadow= '1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000';

    });
    imageContainer.addEventListener('mouseout', function () {
      this.style.color = "rgba(255, 255, 255, 0.0)";
      this.style.textShadow = "none";
    });

    imageContainer.innerText = title;

    var linker = document.createElement('a');
    linker.href = imgsrc;
    linker.appendChild(imageContainer);


    content.appendChild(linker);

  }

}

function populateHistoryBar (history = (JSON.parse(window.localStorage.getItem("history")) || {})) {
  historySec.innerText = "History: ";
  var order = Object.keys(history).reverse();
  for (var i = 0; i < 10 && i < order.length; i++) {
    let term = document.createElement('p');
    term.innerText = order[i];

    term.addEventListener('click', function () {
      searchInput.value = this.innerText;
      searchButton.click();
    });

    historySec.appendChild(term);
  }

  return order[0];
}

searchButton.addEventListener('click', () => {
  search(searchInput.value);
  var history = JSON.parse(window.localStorage.getItem("history")) || {};
  if (history[searchInput.value]) delete history[searchInput.value];
  history[searchInput.value] = searchInput.value;
  window.localStorage.setItem("history", JSON.stringify(history));

  populateHistoryBar();

});

searchInput.addEventListener('keypress', (k) => {
  if (k.keyCode === 13) {
    searchButton.click();
  }
});

if (searchInput.value = populateHistoryBar() || "")
  searchButton.click();
