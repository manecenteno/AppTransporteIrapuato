class Iconos {
    constructor(iconUrl) {
        this.iconUrl = iconUrl;
        this.iconSize = [40, 40];
        this.iconAnchor = [20, 40];
        this.popupAnchor = [0, -40];
    };
}

class Capas {
    constructor(coordenadas, color, iconoInicio, iconoFin, popupInicio, popupFin) {
        this.coordenadas = coordenadas;
        this.trayecto = L.polyline(this.coordenadas, { color: color });
        this.marcadorInicio = L.marker(this.coordenadas[0], { icon: iconoInicio, }).bindPopup(popupInicio);
        this.marcadorFin = L.marker(coordenadas[coordenadas.length - 1], { icon: iconoFin, }).bindPopup(popupFin);
        this.ruta = L.layerGroup([this.trayecto, this.marcadorInicio, this.marcadorFin,]);
    }
}

export { Iconos, Capas };