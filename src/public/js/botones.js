//Boton ir arriba
const btnArriba = document.getElementById("btnArriba");
const btnMapa = document.getElementById("btnMapa");

btnMapa.classList.add("btn-mapa-on");

//Acciones botón ir arriba
btnArriba.addEventListener("click", () => {
    window.scrollTo(0, 0);
});

function modificarClases() {
    if (window.scrollY < 30) {
        btnArriba.classList.remove("btn-scroll-on");

    } else {
        btnArriba.classList.add("btn-scroll-on");
    }
    if (window.scrollY < 190 ) {
        btnMapa.classList.add("btn-mapa-on");
    } else {
        btnMapa.classList.remove("btn-mapa-on");
    }
};

window.onscroll = () => {
    modificarClases();
};













