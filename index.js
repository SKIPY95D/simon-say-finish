
/**
 * Variables de configuracón del juego
 */

 
const opciones = {
  top_left: {
    id: "top_left"
  },
  top_right: {
    id: "top_right"
  },
  bottom_left: {
    id: "bottom_left"
  },
  bottom_right: {
    id: "bottom_right"
  },
};

const estadoJuego = {
  intervalos: {
    inicio: 1000,
    paso: 500
  },
  segundosInicio: 3,
  interaciones: false,
  secuenciaJuego: [],
  secuenciaUsuario: [],
  nivelJuego: 0,
  nivelUsuario: 0,
  opciones,
};

/**
 * Referencias DOM
 */

const botonesDelJuego = document.querySelectorAll(".simon-button");

/**
 * Métodos de ayuda para interactuar con los elementos del DOM
 */

const activarElemento = (elementoDOM) => {
  elementoDOM.classList.add("active");
}

const mostrarElemento = (elementoDOM) => {
  elementoDOM.classList.add("show");
  elementoDOM.classList.remove("hide");
}

const desactivarElemento = (elementoDOM) => {
  elementoDOM.classList.remove("active");
}

const ocultarElemento = (elementoDOM) => {
  elementoDOM.classList.add("hide");
  elementoDOM.classList.remove("show");
}

const activarElementos = (elementos) => {
  elementos.forEach(activarElemento);
};

const desactivarElementos = (elementos) => {
  elementos.forEach(desactivarElemento);
};

const obtenerElementoDom = (id) => {
  return window.document.getElementById(id);
};

// interacciones

const activarInteracciones = () => {
  const elementoTexto = obtenerElementoDom("turno_texto");
  mostrarElemento(elementoTexto);
  elementoTexto.textContent = "Tu turno";
  //Mostrar nivel
  const nivelMostrar = obtenerElementoDom("nivelId");
  mostrarElemento(nivelMostrar);
  nivelMostrar.textContent = `${estadoJuego.nivelJuego}`;

  
  estadoJuego.interaciones = true;
};

const desactivarInteracciones = () => {
  const elementoTexto = obtenerElementoDom("turno_texto");
  ocultarElemento(elementoTexto);

  estadoJuego.interaciones = false;
};

/**
 * Acción del modal para iniciar el juego
 */

const accionModalInicio = () => {
  // Se obtiene el nombre del jugador
  const inputDom = obtenerElementoDom("nombre_jugador");
  const nombreJugador = inputDom.value;

  // Se valida que se haya cargado algún dato
  const permitirAcceso = nombreJugador.length;
  
  if (permitirAcceso) {
    // Se oculta el modal de inicio
    const elementoModalInicio = obtenerElementoDom("inicio_juego");
    ocultarElemento(elementoModalInicio);

    // Se muestra el nombre en pantalla y se guarda en localstorage
    const elementoNombre = obtenerElementoDom("nombre_usuario");
    elementoNombre.textContent = nombreJugador;
    window.localStorage.setItem("nombre", nombreJugador);
    
    // Se comienza el juego
    inicializacion();
  }
};

/**
 * Acción del modal para reiniciar el juego
 */

const accionModalFin = () => {
  // Se oculta el modal de final
  const elementoModalFinal = obtenerElementoDom("fin_juego");
  ocultarElemento(elementoModalFinal);

  // Se comienza el juego
  inicializacion();
};

/**
 * Acción del botón del juego del usuario
 */

const clickBoton = (id) => {
  if (!estadoJuego.interaciones) {
    return;
  }

  // Se guarda en la secuencia del usuario el ID seleccionado
  estadoJuego.secuenciaUsuario.push(id);
  
  // Se obtiene el ID del paso de la secuencia del juego y la del usuario para compararlas
  const secuenciaJuegoEstaEtapa = estadoJuego.secuenciaJuego[estadoJuego.nivelUsuario];
  const secuenciaUsuarioEstaEtapa = estadoJuego.secuenciaUsuario[estadoJuego.nivelUsuario];
  
  // Se comparan las secuencias del usuario y la del juego
  if (secuenciaJuegoEstaEtapa === secuenciaUsuarioEstaEtapa) {
    // Se incrementa el nivel del usuario
    estadoJuego.nivelUsuario = estadoJuego.nivelUsuario + 1;
  } else {
    // Se oculta el juego
    const elementoJuego = obtenerElementoDom("juego");
    ocultarElemento(elementoJuego);

    // Se desactivan interacciones
    desactivarInteracciones();

    // Se muestra el modal de fin
    const elementoModalFinal = obtenerElementoDom("fin_juego");
    mostrarElemento(elementoModalFinal);

    // Mostrar puntaje del juego
    const puntajeDom = obtenerElementoDom("puntaje");
    puntajeDom.textContent = `Tu puntaje es ${estadoJuego.nivelJuego}`;

    return;
  }
  
  // Se verifica que el usuario y el juego esten en el mismo nivel
  if (estadoJuego.nivelJuego === estadoJuego.nivelUsuario) {
    // Se apagan las interacciones
    desactivarInteracciones();
    
    // Se resetea la secuencia del usuario
    estadoJuego.secuenciaUsuario = [];
    
    // Se resetea el nivel del usuario
    estadoJuego.nivelUsuario = 0;

    // Se reproduce una nueva secuencia
    reproducirSecuencia();
  }
};

/**
 * Métodos de obtención de un elemento aleatorio
 */

const obtenerElementoAleatorio = () => {
  const opcionesIds = Object.keys(estadoJuego.opciones);
  const idAleatorio = opcionesIds[Math.floor(Math.random() * opcionesIds.length)];
  
  return estadoJuego.opciones[idAleatorio];
};

/**
 * Función de reproducción de secuencia
 */

const reproducirSecuencia = () => {
  // Variable de pasos al comienzo de la secuencia
  let paso = 0;
  
  // Se agrega un ID a la secuencia de juego y se incrementa 
  estadoJuego.secuenciaJuego.push(obtenerElementoAleatorio().id);
  estadoJuego.nivelJuego = estadoJuego.nivelJuego + 1;


  // Se define un intervalo para mostrar y ocultar cada paso
  const intervalo = setInterval(() => {
    // Se define una variable para generar una pausa entre cada paso
    const pausaPaso = paso % 2 === 1;
    // Se define una variable para determinar si es el último paso
    const finReprodduccion = paso === (estadoJuego.secuenciaJuego.length * 2);

    if (pausaPaso) {
      // Se desactivan todos los botones del juego
      desactivarElementos(botonesDelJuego);
      
      // Se incrementa un paso
      paso++;

      return;
    }

    if (finReprodduccion) {
      // Se elimina intervalo
      clearInterval(intervalo);
      
      // Se desactivan todos los botones del juego
      desactivarElementos(botonesDelJuego);
      
      // Se activan las interacciones del usuario
      activarInteracciones();

      return;
    }

    // Se obtiene la referencia del DOM del elemento del paso de la secuencia para encenderla
    const id = estadoJuego.secuenciaJuego[paso / 2];
    const referenciaDOM = obtenerElementoDom(id);
    activarElemento(referenciaDOM)
  
    // Se incrementa un paso
    paso++;
  }, estadoJuego.intervalos.paso);
};

/**
 * Función de inicialización del juego
 */

const inicializacion = () => {
  // Variable de segundos antes de comenzar
  let segundosInicio = estadoJuego.segundosInicio;

  // Se resetea juego
  estadoJuego.secuenciaJuego = [];
  estadoJuego.secuenciaUsuario = [];
  estadoJuego.nivelJuego = 0;
  estadoJuego.nivelUsuario = 0;
  
  // Se muestra el HTML del juego
  const elementoJuego = obtenerElementoDom("juego");
  mostrarElemento(elementoJuego);

  // Se actualiza el contador HTML
  const elementoCuentaRegresiva = obtenerElementoDom("cuenta_regresiva");
  mostrarElemento(elementoCuentaRegresiva);
  elementoCuentaRegresiva.textContent = segundosInicio;
  
  // Se define un intervalo por el tiempo antes de comenzar
  const intervalo = setInterval(() => {
    // Se descuenta 1 segundo
    segundosInicio--;

    // Se actualiza el contador HTML
    elementoCuentaRegresiva.textContent = segundosInicio;

    if (segundosInicio === 0) {
      // Se oculta el contador HTML
      ocultarElemento(elementoCuentaRegresiva);

      // Se reproduce la primer secuencia
      reproducirSecuencia();

      // Se elimina intervalo
      clearInterval(intervalo);
    }
  }, estadoJuego.intervalos.inicio);
};

const nombreJugadorStorage = window.localStorage.getItem("nombre");
const elementoNombre = obtenerElementoDom("nombre_jugador");
elementoNombre.value = nombreJugadorStorage || "";

//Controlar musica

let v = document.getElementsByTagName("audio")[0];
let sound = false;
 
let boton = document.getElementById("boton");
 boton.addEventListener("click", function(){
	if (!sound) {
		v.play();
		this.innerHTML = "Music Off";
		sound = true;
		console.log(this);
	} else {
		v.pause();
		this.innerHTML = "Music On";
		sound = false;
	}
 });