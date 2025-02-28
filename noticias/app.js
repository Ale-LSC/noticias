// Definição da API Key e elementos DOM
const apiKey = '433aac309a0e4c06846d4b7c56154fe7';
const searchInput = document.getElementById('search');
const searchButton = document.getElementById('search-btn');
const navbarLinks = document.querySelectorAll('.navbar a');
const hamburger = document.getElementById('hamburger');
const navbar = document.querySelector('.navbar');

const containers = {
    sports: document.getElementById('news-container-sport'),
    health: document.getElementById('news-container-health'),
    politics: document.getElementById('news-container-politics'),
    general: document.getElementById('news-container-general'),
    technology: document.getElementById('news-container-technology'),
    entertainment: document.getElementById('news-container-entertainment'),
};

// Função para buscar notícias
async function fetchNews(query, category = null, targetContainer) {
    if (!targetContainer) return;

    const url = category
        ? `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${apiKey}`
        : `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== 'ok' || !data.articles) {
            throw new Error(`Erro na API: ${data.message || 'Resposta inválida'}`);
        }

        displayNews(data.articles, targetContainer);
    } catch (error) {
        console.error('Erro ao buscar notícias:', error);
        targetContainer.innerHTML = `<p>Erro ao carregar notícias. Tente novamente mais tarde.</p>`;
    }
}

// Função para exibir notícias no contêiner
function displayNews(articles, targetContainer) {
    targetContainer.innerHTML = '';
    if (!articles || articles.length === 0) {
        targetContainer.innerHTML = '<p>Nenhuma notícia encontrada.</p>';
        return;
    }

    articles.forEach(article => {
        const newsItem = document.createElement('div');
        newsItem.classList.add('news-item');
        newsItem.innerHTML = `
            <h2>${article.title}</h2>
            <img src="${article.urlToImage || 'https://via.placeholder.com/300'}" alt="${article.title}">
            <p>${article.description || 'Descrição não disponível'}</p>
            <a href="${article.url}" target="_blank">Leia mais</a>
        `;
        targetContainer.appendChild(newsItem);
    });
}

// Evento para links da navbar
navbarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = e.target.getAttribute('data-category');
        const container = containers[category] || containers.general;
        fetchNews(null, category, container);
    });
});

// Evento de busca
if (searchButton && searchInput) {
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            fetchNews(query, null, containers.general);
        }
    });
}

// Carregar notícias iniciais por categoria
Object.keys(containers).forEach(category => {
    const container = containers[category];
    if (container) {
        fetchNews(null, category, container);
    }
});

// Evento para alternar a visibilidade do menu no mobile
if (hamburger && navbar) {
    hamburger.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });
} else {
    console.error('Elementos "hamburger" ou "navbar" não encontrados no DOM.');
}
