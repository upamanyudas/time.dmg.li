// Simple search functionality
const searchInput = document.getElementById('search');
const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Set placeholder based on platform
if (!isMobile) {
    searchInput.placeholder = `Search documentation... (${isMac ? '⌘' : 'Ctrl'}+K)`;
} else {
    searchInput.placeholder = 'Search documentation...';
}

// Keyboard shortcut to focus search
document.addEventListener('keydown', function(e) {
    if ((isMac && e.metaKey && e.key === 'k') || (!isMac && e.ctrlKey && e.key === 'k')) {
        e.preventDefault();
        searchInput.focus();
    }
});

// Add clear button
const clearBtn = document.createElement('button');
clearBtn.innerHTML = '×';
clearBtn.className = 'search-clear';
clearBtn.style.cssText = 'position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:none;font-size:18px;cursor:pointer;color:#666;display:none;';
searchInput.parentNode.style.position = 'relative';
searchInput.parentNode.appendChild(clearBtn);

// Show/hide clear button and handle clear
searchInput.addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();
    clearBtn.style.display = query ? 'block' : 'none';
    
    const sections = document.querySelectorAll('.doc-section');
    sections.forEach(section => {
        const keywords = section.dataset.keywords.toLowerCase();
        const text = section.textContent.toLowerCase();
        const isMatch = query === '' || keywords.includes(query) || text.includes(query);
        section.style.display = isMatch ? 'block' : 'none';
    });
});

clearBtn.addEventListener('click', function() {
    searchInput.value = '';
    searchInput.focus();
    clearBtn.style.display = 'none';
    searchInput.dispatchEvent(new Event('input'));
});