import './style.css';

const cars = [
  { id: 'i7', brand: 'BMW', name: 'BMW i7 xDrive60', type: 'Електро', price: 149900, year: 2024, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85', specs: ['544 к.с.', '625 км', '4.7 с', 'Повний'] },
  { id: 'q8', brand: 'Audi', name: 'Audi Q8 e-tron', type: 'Електро', price: 102500, year: 2024, image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=85', specs: ['408 к.с.', '582 км', '5.6 с', 'Повний'] },
  { id: 'g-class', brand: 'Mercedes-Benz', name: 'Mercedes-Benz G 63', type: 'Бензин', price: 189000, year: 2024, image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=85', specs: ['585 к.с.', '13.1 л', '4.5 с', 'Повний'] },
  { id: 'taycan', brand: 'Porsche', name: 'Porsche Taycan 4S', type: 'Електро', price: 121800, year: 2024, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85', specs: ['530 к.с.', '464 км', '4.0 с', 'Повний'] }
];

const grid = document.querySelector('#carGrid');
const selected = new Set();
const money = value => new Intl.NumberFormat('en-US').format(value);

function renderCars(list) {
  grid.innerHTML = list.map((car, index) => `<article class="car-card" style="--delay:${index * 60}ms"><div class="car-image"><img src="${car.image}" alt="${car.name}" loading="lazy"/><span class="tag">${car.type}</span><button class="heart" data-favorite="${car.id}" aria-label="Додати в обране">♡</button><button class="image-nav" aria-label="Наступне фото">→</button></div><div class="car-content"><div class="car-title"><div><span>${car.brand}</span><h3>${car.name.replace(car.brand + ' ', '')}</h3></div><strong>$${money(car.price)}</strong></div><div class="car-specs"><span>${car.specs[0]}</span><span>${car.specs[1]}</span><span>${car.specs[3]}</span></div><div class="card-bottom"><span>${car.year} · Автомат</span><button class="compare-add ${selected.has(car.id) ? 'selected' : ''}" data-id="${car.id}">${selected.has(car.id) ? '✓ Додано' : '+ Порівняти'}</button></div></div></article>`).join('');
  document.querySelector('#resultCount').textContent = `${list.length} ${list.length === 1 ? 'автомобіль' : 'автомобілі'} `;
}
function renderComparison() {
  const chosen = cars.filter(c => selected.has(c.id));
  document.querySelector('#navCompareCount').textContent = chosen.length ? `(${chosen.length})` : '';
  const preview = document.querySelector('#comparePreview');
  preview.innerHTML = chosen.length ? chosen.map(c => `<div class="mini-car"><img src="${c.image}" alt=""/><span>${c.brand}</span><strong>${c.name.replace(c.brand + ' ', '')}</strong><button data-remove="${c.id}" aria-label="Видалити">×</button></div>`).join('') : '<div class="compare-empty">Оберіть до 4 авто<br /><small>у картках каталогу</small></div>';
  document.querySelector('#comparisonTable').innerHTML = chosen.length ? `<table><thead><tr><th>Характеристика</th>${chosen.map(c => `<th>${c.name}</th>`).join('')}</tr></thead><tbody>${[['Ціна', ...chosen.map(c => '$' + money(c.price))], ['Рік', ...chosen.map(c => c.year)], ['Потужність', ...chosen.map(c => c.specs[0])], ['Запас ходу / витрата', ...chosen.map(c => c.specs[1])], ['0–100 км/год', ...chosen.map(c => c.specs[2])], ['Привід', ...chosen.map(c => c.specs[3])]].map(row => `<tr>${row.map((cell, i) => `<${i ? 'td' : 'th'}>${cell}</${i ? 'td' : 'th'}>`).join('')}</tr>`).join('')}</tbody></table>` : '<p>Додайте автомобілі з каталогу, щоб почати порівняння.</p>';
}
function applyFilters(event) {
  event?.preventDefault();
  const brand = document.querySelector('#brandFilter').value;
  const model = document.querySelector('#modelFilter').value;
  const price = Number(document.querySelector('#priceFilter').value);
  const fuel = document.querySelector('#fuelFilter').value;
  let filtered = cars.filter(c => (brand === 'all' || c.brand === brand) && (model === 'all' || c.id === model) && (!price || c.price <= price) && (fuel === 'all' || c.type === fuel));
  const sort = document.querySelector('#sortSelect').value;
  if (sort === 'low') filtered.sort((a,b) => a.price-b.price);
  if (sort === 'high') filtered.sort((a,b) => b.price-a.price);
  renderCars(filtered);
}

document.querySelector('#filterForm').addEventListener('submit', applyFilters);
document.querySelector('#sortSelect').addEventListener('change', applyFilters);
document.querySelector('#advancedToggle').addEventListener('click', e => { const panel = document.querySelector('#advancedFilters'); panel.hidden = !panel.hidden; e.currentTarget.classList.toggle('opened', !panel.hidden); });
document.querySelector('#fuelFilter').addEventListener('change', applyFilters);
grid.addEventListener('click', e => {
  const compare = e.target.closest('[data-id]'); const favorite = e.target.closest('[data-favorite]');
  if (favorite) { favorite.classList.toggle('liked'); favorite.textContent = favorite.classList.contains('liked') ? '♥' : '♡'; }
  if (!compare) return;
  const id = compare.dataset.id;
  if (selected.has(id)) selected.delete(id); else if (selected.size < 4) selected.add(id); else { compare.textContent = 'Максимум 4'; return; }
  applyFilters(); renderComparison();
});
document.querySelector('#comparePreview').addEventListener('click', e => { const remove = e.target.closest('[data-remove]'); if (remove) { selected.delete(remove.dataset.remove); applyFilters(); renderComparison(); } });
document.querySelector('#compareButton').addEventListener('click', () => document.querySelector('#compareDialog').showModal());
document.querySelector('#dialogClose').addEventListener('click', () => document.querySelector('#compareDialog').close());
document.querySelector('#themeToggle').addEventListener('click', () => document.body.classList.toggle('light-theme'));
document.querySelector('#gridView').addEventListener('click', () => { grid.classList.remove('list'); document.querySelector('#gridView').classList.add('active'); document.querySelector('#listView').classList.remove('active'); });
document.querySelector('#listView').addEventListener('click', () => { grid.classList.add('list'); document.querySelector('#listView').classList.add('active'); document.querySelector('#gridView').classList.remove('active'); });
renderCars(cars); renderComparison();
