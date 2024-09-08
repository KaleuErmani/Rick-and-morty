const cardsContainer = document.getElementById('cards-container');
const buttonNext = document.getElementById('nextButton');
const buttonPrev = document.getElementById('prevButton');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const paginationInfo = document.getElementById('pagination-info');

const modalImage = document.getElementById('modalImage');
const modalName = document.getElementById('modalName');
const modalStatus = document.getElementById('modalStatus');
const modalSpecies = document.getElementById('modalSpecies');
const modalOrigin = document.getElementById('modalOrigin');
const modalLocation = document.getElementById('modalLocation');

let allCharacters = []; 
let filteredCharacters = [];
let currentPage = 1;
const charactersPerPage = 6;

// Função para buscar todos os personagens da API
async function fetchAllCharacters() {
  let page = 1;
  let allDataFetched = false;

  while (!allDataFetched) {
    try {
      const { data } = await api.get(`/character/?page=${page}`);
      allCharacters = allCharacters.concat(data.results);
      page++;

      if (page > data.info.pages) {
        allDataFetched = true;
      }
    } catch (error) {
      console.error('Erro ao buscar personagens:', error);
      break;
    }
  }

  filteredCharacters = allCharacters;
  setView();
}

// Função para renderizar os personagens
function setView() {
  cardsContainer.innerHTML = '';
  const startIndex = (currentPage - 1) * charactersPerPage;
  const endIndex = Math.min(startIndex + charactersPerPage, filteredCharacters.length);

  if (filteredCharacters.length === 0) {
    cardsContainer.innerHTML = '<p>Não foram encontrados personagens.</p>';
    return;
  }

  for (let i = startIndex; i < endIndex; i++) {
    const character = filteredCharacters[i];
    const card = document.createElement('div');
    card.classList.add('card', 'col-md-3', 'mb-4');
    card.innerHTML = `
      <img src="${character.image}" class="card-img-top" alt="${character.name}">
      <div class="card-body">
        <h5 class="card-title">${character.name}</h5>
        <p class="card-text">${character.species}</p>
        <button class="btn btn-primary pagination-button" data-bs-toggle="modal" data-bs-target="#infoCharacters" data-id="${character.id}">Mais informações</button>
      </div>
    `;
    cardsContainer.appendChild(card);
  }

  updatePaginationButtons();
}


// Função para atualizar os botões de paginação e a informação de página
function updatePaginationButtons() {
  const totalPages = Math.ceil(filteredCharacters.length / charactersPerPage);

  // Atualiza o estado dos botões
  buttonPrev.disabled = currentPage <= 1;
  buttonNext.disabled = currentPage >= totalPages;

  // Atualiza a informação de paginação
  paginationInfo.innerText = `${currentPage}/${totalPages}`;
}

// Capturando eventos de paginação
buttonNext.addEventListener('click', () => {
  currentPage++;
  setView();
});

buttonPrev.addEventListener('click', () => {
  currentPage--;
  setView();
});

// Evento para o formulário de busca
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = searchInput.value.trim().toLowerCase();
  currentPage = 1;

  filteredCharacters = allCharacters.filter(character =>
    character.name.toLowerCase().includes(query)
  );
  
  setView();
});

// Inicializar a visualização ao carregar a página
document.addEventListener('DOMContentLoaded', async () => {
  await fetchAllCharacters(); // Buscar todos os personagens ao carregar a página
  setView();
});

// Evento para abrir o modal com informações do personagem
cardsContainer.addEventListener('click', async (event) => {
  if (event.target.matches('[data-bs-toggle="modal"]')) {
    const characterId = event.target.getAttribute('data-id');
    try {
      const { data } = await api.get(`/character/${characterId}`);
      const character = data;

      modalImage.src = character.image;
      modalName.innerText = character.name;
      modalStatus.innerText = character.status;
      modalSpecies.innerText = character.species;
      modalOrigin.innerText = character.origin.name;
      modalLocation.innerText = character.location.name;
    } catch (error) {
      console.error('Erro ao carregar informações do personagem:', error);
    }
  }
});
