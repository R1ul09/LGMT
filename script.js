document.getElementById('remove-bubbles').addEventListener('click', function() {
    document.querySelectorAll('.bubble').forEach(bubble => bubble.remove());
});

// Función para alternar modo oscuro
document.getElementById('dark-mode-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
});

// Comprobar si el modo oscuro está activado al cargar
if (localStorage.getItem('dark-mode') === 'true') {
    document.body.classList.add('dark-mode');
}