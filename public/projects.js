document.addEventListener('DOMContentLoaded', () => {
  fetch('projects.json')
    .then((res) => res.json())
    .then((data) => {
      renderProjects(data);
      setupFilters(data);
    })
    .catch((err) => console.error('Failed to load projects', err));
});

function renderProjects(projects) {
  const grouped = groupBy(projects, 'category');
  const container = document.getElementById('projects');
  container.innerHTML = '';
  Object.keys(grouped).forEach((cat) => {
    const section = document.createElement('section');
    section.className = 'category';
    section.dataset.category = cat;

    const header = document.createElement('h2');
    header.textContent = cat;
    section.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'card-grid';

    grouped[cat].forEach((p) => {
      grid.appendChild(buildCard(p));
    });

    section.appendChild(grid);
    container.appendChild(section);
  });
}

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    (acc[item[key]] = acc[item[key]] || []).push(item);
    return acc;
  }, {});
}

function buildCard(p) {
  const article = document.createElement('article');
  article.className = 'project-card';

  const status = document.createElement('span');
  status.className = `status status-${p.status}`;
  status.textContent = p.status;
  article.appendChild(status);

  const title = document.createElement('h3');
  const link = document.createElement('a');
  link.href = p.repo;
  link.textContent = p.title;
  link.target = '_blank';
  title.appendChild(link);
  article.appendChild(title);

  const tagline = document.createElement('p');
  tagline.className = 'tagline';
  tagline.textContent = p.tagline;
  article.appendChild(tagline);

  const techList = document.createElement('div');
  techList.className = 'tech-badges';
  p.tech.forEach((t) => {
    const span = document.createElement('span');
    span.className = 'tech-badge';
    span.textContent = t;
    techList.appendChild(span);
  });
  article.appendChild(techList);

  const stars = document.createElement('div');
  stars.className = 'stars';
  stars.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.87 1.402-8.168L.132 9.211l8.2-1.193z"/></svg>' +
    ` ${p.stars}`;
  article.appendChild(stars);

  const last = document.createElement('p');
  last.className = 'last-updated';
  last.textContent = `Updated ${formatDate(p.last_updated)}`;
  article.appendChild(last);

  const badgeList = document.createElement('div');
  badgeList.className = 'badges';
  p.badges.forEach((b) => {
    const span = document.createElement('span');
    span.className = 'badge';
    span.textContent = b;
    badgeList.appendChild(span);
  });
  article.appendChild(badgeList);

  return article;
}

function formatDate(iso) {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function setupFilters(projects) {
  const categories = Array.from(new Set(projects.map((p) => p.category)));
  const filterNav = document.querySelector('.category-filter');
  const allBtn = document.createElement('button');
  allBtn.textContent = 'All';
  allBtn.className = 'active';
  allBtn.addEventListener('click', () => filter('All'));
  filterNav.appendChild(allBtn);

  categories.forEach((cat) => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.addEventListener('click', () => filter(cat));
    filterNav.appendChild(btn);
  });

  function filter(cat) {
    document
      .querySelectorAll('.category-filter button')
      .forEach((btn) => btn.classList.toggle('active', btn.textContent === cat));
    document.querySelectorAll('#projects .category').forEach((section) => {
      section.style.display =
        cat === 'All' || section.dataset.category === cat ? '' : 'none';
    });
  }
}
