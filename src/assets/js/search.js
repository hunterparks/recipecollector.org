(function () {
    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');
    if (!input || !results) return;

    let fuse = null;

    fetch('/search.json')
        .then((r) => r.json())
        .then((data) => {
            fuse = new Fuse(data, {
                keys: ['name'],
                threshold: 0.4,
                distance: 100,
                minMatchCharLength: 2,
            });
        });

    function renderResults(items) {
        results.innerHTML = '';
        if (!items.length) {
            results.hidden = true;
            return;
        }
        items.forEach(({ item }, index) => {
            const li = document.createElement('li');
            li.setAttribute('role', 'option');
            li.dataset.index = index;
            const a = document.createElement('a');
            a.href = item.url;
            a.textContent = item.name;
            li.appendChild(a);
            results.appendChild(li);
        });
        results.hidden = false;
    }

    function closeResults() {
        results.hidden = true;
        results.innerHTML = '';
    }

    function getFocusedIndex() {
        const focused = results.querySelector('li.focused');
        return focused ? parseInt(focused.dataset.index, 10) : -1;
    }

    function moveFocus(direction) {
        const items = results.querySelectorAll('li');
        if (!items.length) return;
        const current = getFocusedIndex();
        items.forEach((li) => li.classList.remove('focused'));
        let next = current + direction;
        if (next < 0) next = items.length - 1;
        if (next >= items.length) next = 0;
        items[next].classList.add('focused');
        items[next].querySelector('a').focus();
    }

    input.addEventListener('input', () => {
        const query = input.value.trim();
        if (!fuse || query.length < 2) {
            closeResults();
            return;
        }
        const matches = fuse.search(query, { limit: 8 });
        renderResults(matches);
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeResults();
            input.blur();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            moveFocus(1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            moveFocus(-1);
        }
    });

    results.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeResults();
            input.focus();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            moveFocus(1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            moveFocus(-1);
        }
    });

    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !results.contains(e.target)) {
            closeResults();
        }
        const dropdown = document.querySelector('.tags-dropdown');
        if (dropdown && !dropdown.contains(e.target)) {
            dropdown.removeAttribute('open');
        }
    });

    input.addEventListener('focus', () => {
        const query = input.value.trim();
        if (fuse && query.length >= 2) {
            const matches = fuse.search(query, { limit: 8 });
            renderResults(matches);
        }
    });
})();
