/* Patron modulo */
const miModulo = (() => {
    "use strict"

    let deck = [];
    const tipos = ["C", "D", "H", "S"],
        especiales = ["A", "J", "Q", "K"];

    let puntosJugadores = [];

    /* Referencias HTML */
    const btnNuevoJuego = document.querySelector("#btnNuevoJuego"),
        btnPedirCarta = document.querySelector("#btnPedirCarta"),
        btnDetener = document.querySelector("#btnDetener"),
        puntajes = document.querySelectorAll("small"),
        cartasJugadores = document.querySelectorAll(".cartas");

    const deshabilitarBotones = () => {
        btnPedirCarta.disabled = true;
        btnDetener.disabled = true;
        btnPedirCarta.classList.remove("bg-blue-500", "hover:bg-blue-700");
        btnPedirCarta.classList.add("bg-blue-300");
        btnDetener.classList.remove("bg-red-500", "hover:bg-red-700");
        btnDetener.classList.add("bg-red-300");
    }

    deshabilitarBotones();

    /* Esta funcion inicializa el juego */
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = [];
        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }

        puntajes.forEach(elem => elem.innerText = 0);
        cartasJugadores.forEach(elem => elem.innerHTML = "");
        rehabilitarBotones();
    }

    const crearDeck = () => {
        deck = [];
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

        return _.shuffle(deck);
    }

    const pedirCarta = () => {

        if (deck.length === 0) {
            throw "No hay mas cartas en el deck";
        }
        return deck.pop();
    }

    const valorCarta = carta => {
        const valor = carta.substring(0, carta.length - 1);
        return isNaN(valor) ?
            valor === "A" ? 11 : 10
            : valor * 1;/* El * 1 es una forma facil de convertir de String a number */
    }

    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntajes[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement("img");
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add("w-40", "relative", "left-20", "-ml-20", "inline");
        cartasJugadores[turno].append(imgCarta);
    }

    const getGanador = () => {
        const [puntosMinimos, puntosComputadora] = puntosJugadores;
        setTimeout(() => {
            if (puntosComputadora === puntosMinimos) {
                console.warn("Nadie gana");
            } else if (puntosMinimos > 21) {
                console.warn("Computadora gana");
            } else if (puntosComputadora > 21) {
                console.warn("Jugador gana");
            } else {
                console.warn("Computadora gana");
            }
        }, 100);
    }

    const turnoComputadora = puntosMinimos => {
        let puntosComputadora = 0;
        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
            crearCarta(carta, puntosJugadores.length - 1);

        } while ((puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));

        getGanador();
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
        const puntosJugador = acumularPuntos(carta, 0);

        crearCarta(carta, 0);

        if (puntosJugador >= 21) {
            deshabilitarBotones();
            turnoComputadora(puntosJugador);
        }/*  else if (puntosJugador === 21) {
            deshabilitarBotones();
            turnoComputadora(puntosJugador);
        } */
    });

    btnDetener.addEventListener("click", () => {
        deshabilitarBotones();
        turnoComputadora(puntosJugadores[0]);
    });

    btnNuevoJuego.addEventListener("click", () => {
        inicializarJuego();
    });

    /* Solo lo que se retorna sera publico, lo demas continuara siendo privado */
    return {
        nuevoJuego: inicializarJuego
    };
})();
