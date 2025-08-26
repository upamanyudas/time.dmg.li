// Simple search functionality
document.getElementById('search').addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();
    const sections = document.querySelectorAll('.doc-section');
    
    sections.forEach(section => {
        const keywords = section.dataset.keywords.toLowerCase();
        const text = section.textContent.toLowerCase();
        const isMatch = query === '' || keywords.includes(query) || text.includes(query);
        section.style.display = isMatch ? 'block' : 'none';
    });
});