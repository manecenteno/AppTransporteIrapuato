//Manejador del evento al cambiar el select
let lista = document.getElementById("listaRutas")

dselect(lista, {
    search: true,
    maxHeight: '200px'
});

lista.addEventListener("change", async (e) => {
    let nombre = { nombre: document.getElementById("listaRutas").value };

    //Peticion para buscar la ruta y obtener datos
    const horariosRuta = await fetch("/horarios", {
        method: "POST",
        body: JSON.stringify(nombre),
        headers: { "Content-type": "application/json; charset=UTF-8" },
    }).then((horariosRuta) => horariosRuta.json());
    agregarHorarios(horariosRuta)
});

function agregarHorarios(horariosRuta) {

    const horarios = document.getElementById("horarios")
    const ida = document.getElementById("ida")
    const vuelta = document.getElementById("vuelta")
    const ips = document.getElementById("ips")
    const is = document.getElementById("is")
    const ifs = document.getElementById("ifs")
    const vps = document.getElementById("vps")
    const vis = document.getElementById("vis")
    const vfs = document.getElementById("vfs")

    let recorrido1 = horariosRuta.recorrido1
    let recorrido2 = horariosRuta.recorrido2
    let arr = horariosRuta.nombre.split('/')

    ida.textContent = "Salida: " + arr[0]
    ips.textContent = "Primer servicio: " + recorrido1.primerServicio + " a.m."
    is.textContent = "Intervalo del servicio: " + recorrido1.intervaloServicio + " minutos"
    ifs.textContent = "Último servicio: " + recorrido1.ultimoServicio + " p.m."

    vuelta.textContent = "Salida: " + arr[arr.length - 1]
    vps.textContent = "Primer servicio: " + recorrido2.primerServicio + " a.m."
    vis.textContent = "Intervalo del servicio: " + recorrido2.intervaloServicio + " minutos"
    vfs.textContent = "Último servicio: " + recorrido2.ultimoServicio + " p.m."

    horarios.classList.remove("visually-hidden")
}
