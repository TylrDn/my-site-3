document.addEventListener('DOMContentLoaded', () => {
  fetch('projects.json')
    .then((res) => res.json())
    .then((data) => {
      data.sort(
        (a, b) => new Date(b.last_updated) - new Date(a.last_updated)
      );
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
  const link = document.createElement('a');
  link.className = 'project-card';
  link.href = p.repo;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';

  const status = document.createElement('span');
  status.className = `status status-${p.status}`;
  status.textContent = p.status;
  link.appendChild(status);

  const title = document.createElement('h3');
  title.textContent = p.title;
  link.appendChild(title);

  const tagline = document.createElement('p');
  tagline.className = 'tagline';
  tagline.textContent = p.tagline;
  link.appendChild(tagline);

  const techList = document.createElement('div');
  techList.className = 'tech-badges';
  p.tech.forEach((t) => {
    const span = document.createElement('span');
    span.className = 'tech-badge';
    span.textContent = t;
    techList.appendChild(span);
  });
  link.appendChild(techList);

  const stars = document.createElement('div');
  stars.className = 'stars';
  stars.setAttribute('aria-label', `${p.stars} GitHub stars`);
  stars.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63L2 9.24l5.46 4.73L5.82 21z"/></svg> ${p.stars}`;
  link.appendChild(stars);

  const last = document.createElement('p');
  last.className = 'last-updated';
  last.textContent = `Updated ${formatDate(p.last_updated)}`;
  link.appendChild(last);

  const badgeList = document.createElement('div');
  badgeList.className = 'badges';
  p.badges.forEach((b) => {
    const span = document.createElement('span');
    span.className = 'badge';
    span.textContent = b;
    badgeList.appendChild(span);
  });
  link.appendChild(badgeList);

  return link;
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
  allBtn.type = 'button';
  allBtn.textContent = 'All';
  allBtn.className = 'active';
  allBtn.setAttribute('aria-pressed', 'true');
  allBtn.addEventListener('click', () => filter('All'));
  filterNav.appendChild(allBtn);

  categories.forEach((cat) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = cat;
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', () => filter(cat));
    filterNav.appendChild(btn);
  });

  function filter(cat) {
    document
      .querySelectorAll('.category-filter button')
      .forEach((btn) => {
        const active = btn.textContent === cat;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', String(active));
      });
    document.querySelectorAll('#projects .category').forEach((section) => {
      section.style.display =
        cat === 'All' || section.dataset.category === cat ? '' : 'none';
    });
  }
}
