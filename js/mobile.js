const nav = document.querySelector('nav span i');

nav.addEventListener('click', () => {
    document.querySelector('nav ul').classList.toggle('show');

    if (document.querySelector('nav ul').classList.contains('show')) {
        nav.classList.replace('bi-list', 'bi-x');
    }
    else {
        nav.classList.replace('bi-x','bi-list' );
    }
});