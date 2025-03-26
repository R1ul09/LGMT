document.getElementById('remove-bubbles').addEventListener('click', function() {
    document.querySelectorAll('.bubble').forEach(bubble => bubble.remove());
});