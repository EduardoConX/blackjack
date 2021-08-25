let deck = [];
const tipos = ["C", "D", "H", "S"];
const especiales = ["A", "J", "Q", "K"];

let puntosJugador = 0, puntosComputadora = 0;

/* Referencias HTML */
const btnNuevoJuego = document.querySelector("#btnNuevoJuego");
const btnPedirCarta = document.querySelector("#btnPedirCarta");
const btnDetener = document.querySelector("#btnDetener");
const puntajes = document.querySelectorAll("small");
const cartasJugador = document.querySelector("#cartas-jugador");
const cartasComputadora = document.querySelector("#cartas-computadora");

const crearDeck = () => {
    for (let i = 2; i <= 10; i++) {
        for (let tipo of tipos) {
            deck.push(i + tipo);
        }
    }

    for (let tipo of tipos) {
        for (let esp of especiales) {
            deck.push(esp + tipo);
        }
    }

    deck = _.shuffle(deck);
    return deck;
}

/* Crea una nueva baraja */
crearDeck();

const pedirCarta = () => {

    if (deck.length === 0) {
        throw "No hay mas cartas en el deck";
    }
    const carta = deck.pop();
    return carta;
}

const valorCarta = carta => {
    const valor = carta.substring(0, carta.length - 1);
    return isNaN(valor) ?
        valor === "A" ? 11 : 10
        : valor * 1;/* El * 1 es una forma facil de convertir de String a number */
}

const turnoComputadora = puntosMinimos => {

    do {
        const carta = pedirCarta();
        puntosComputadora = puntosComputadora + valorCarta(carta);
        puntajes[1].innerText = puntosComputadora;

        const imgCarta = document.createElement("img");
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add("w-40", "relative", "left-20", "-ml-20", "inline");
        cartasComputadora.append(imgCarta);
        if (puntosMinimos > 21) {
            break;
        }
    } while ((puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));

    setTimeout(() => {
        if (puntosComputadora === puntosMinimos) {
            console.warn("Nadie gana");
        } else if (puntosMinimos > 21) {
            console.warn("Computadora gana");
        } else if (puntosComputadora > 21) {
            console.warn("Jugador gana");
        }else{
            console.warn("Computadora gana");
        }
    }, 10);
}

const deshabilitarBotones = () => {
    btnPedirCarta.disabled = true;
    btnDetener.disabled = true;
    btnPedirCarta.classList.remove("bg-blue-500", "hover:bg-blue-700");
    btnPedirCarta.classList.add("bg-blue-300");
    btnDetener.classList.remove("bg-red-500", "hover:bg-red-700");
    btnDetener.classList.add("bg-red-300");
}

const rehabilitarBotones = () => {
    btnPedirCarta.disabled = false;
    btnDetener.disabled = false;
    btnPedirCarta.classList.add("bg-blue-500", "hover:bg-blue-700");
    btnPedirCarta.classList.remove("bg-blue-300");
    btnDetener.classList.add("bg-red-500", "hover:bg-red-700");
    btnDetener.classList.remove("bg-red-300");
}

/* Eventos */
btnPedirCarta.addEventListener("click", () => {
    const carta = pedirCarta();
    puntosJugador = puntosJugador + valorCarta(carta);
    puntajes[0].innerText = puntosJugador;

    const imgCarta = document.createElement("img");
    imgCarta.src = `assets/cartas/${carta}.png`;
    imgCarta.classList.add("w-40", "relative", "left-20", "-ml-20", "inline");
    cartasJugador.append(imgCarta);

    if (puntosJugador > 21) {
        deshabilitarBotones();
        turnoComputadora(puntosJugador);
    } else if (puntosJugador === 21) {
        deshabilitarBotones();
        turnoComputadora(puntosJugador);
    }
});

btnDetener.addEventListener("click", () => {
    deshabilitarBotones();
    turnoComputadora(puntosJugador);
});

btnNuevoJuego.addEventListener("click", ()=>{
    deck = [];
    deck = crearDeck();

    puntosJugador = 0;
    puntosComputadora= 0;
    puntajes[0].innerText = 0;
    puntajes[1].innerText = 0;
    cartasJugador.innerHTML = "";
    cartasComputadora.innerHTML = "";
    rehabilitarBotones();
    console.clear();
});