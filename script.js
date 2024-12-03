const searchInput = document.getElementById('search-parts');
const imageBox = document.getElementById('image-box');
const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
const autocompleteList = document.getElementById('autocomplete-list');

// Обновление отображения изображений
function updateImageDisplay() {
    const query = searchInput.value.toLowerCase();
    const activeFilters = Array.from(filterCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    const images = imageBox.querySelectorAll('img');
    images.forEach(img => {
        const altText = img.alt.toLowerCase();
        const categories = img.dataset.category.toLowerCase().split(' ');

        const matchesSearch = query === '' || altText.includes(query);
        const matchesFilters = activeFilters.length === 0 || activeFilters.some(filter => categories.includes(filter));

        if (matchesSearch && matchesFilters) {
            img.style.display = '';
        } else {
            img.style.display = 'none';
        }
    });
}

// Автозаполнение
function updateAutocomplete() {
    const query = searchInput.value.toLowerCase();
    const images = Array.from(imageBox.querySelectorAll('img'));
    const suggestions = Array.from(new Set( // Убираем дубликаты
        images
            .map(img => img.alt)
            .filter(alt => alt.toLowerCase().includes(query))
    )).slice(0, 5); // Ограничиваем 5 вариантами

    autocompleteList.innerHTML = '';
    suggestions.forEach(suggestion => {
        const div = document.createElement('div');
        div.textContent = suggestion;
        div.addEventListener('click', () => {
            searchInput.value = suggestion;
            autocompleteList.style.display = 'none';
            updateImageDisplay();
        });
        autocompleteList.appendChild(div);
    });

    autocompleteList.style.display = suggestions.length > 0 ? 'block' : 'none';
}

// События
searchInput.addEventListener('input', () => {
    updateAutocomplete();
    updateImageDisplay();
});

filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateImageDisplay);
});

// Скрывать список автозаполнения при клике вне
document.addEventListener('click', (e) => {
    if (!e.target.closest('.autocomplete-container')) {
        autocompleteList.style.display = 'none';
    }
});
