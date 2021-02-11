
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

  const inputDom = obtenerElementoDom("nombre_jugador");
  const nombreJugador = inputDom.value;

  const permitirAcceso = nombreJugador.length;
  
  if (permitirAcceso) {
    
    const elementoModalInicio = obtenerElementoDom("inicio_juego");
    ocultarElemento(elementoModalInicio);

   
    const elementoNombre = obtenerElementoDom("nombre_usuario");
    elementoNombre.textContent = nombreJugador;
    window.localStorage.setItem("nombre", nombreJugador);
    
   
    inicializacion();
  }
};

/**
 * Acción del modal para reiniciar el juego
 */

const accionModalFin = () => {
 
  const elementoModalFinal = obtenerElementoDom("fin_juego");
  ocultarElemento(elementoModalFinal);

  
  inicializacion();
};

/**
 * Acción del botón del juego del usuario
 */

const clickBoton = (id) => {
  if (!estadoJuego.interaciones) {
    return;
  }

  
  estadoJuego.secuenciaUsuario.push(id);
  
 
  const secuenciaJuegoEstaEtapa = estadoJuego.secuenciaJuego[estadoJuego.nivelUsuario];
  const secuenciaUsuarioEstaEtapa = estadoJuego.secuenciaUsuario[estadoJuego.nivelUsuario];
  

  if (secuenciaJuegoEstaEtapa === secuenciaUsuarioEstaEtapa) {
    
    estadoJuego.nivelUsuario = estadoJuego.nivelUsuario + 1;
  } else {
   
    const elementoJuego = obtenerElementoDom("juego");
    ocultarElemento(elementoJuego);

  
    desactivarInteracciones();

    
    const elementoModalFinal = obtenerElementoDom("fin_juego");
    mostrarElemento(elementoModalFinal);

    
    const puntajeDom = obtenerElementoDom("puntaje");
    puntajeDom.textContent = `Tu puntaje es ${estadoJuego.nivelJuego}`;

    return;
  }
  
  if (estadoJuego.nivelJuego === estadoJuego.nivelUsuario) {
   
    desactivarInteracciones();
    
    estadoJuego.secuenciaUsuario = [];
  
    estadoJuego.nivelUsuario = 0;

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

  let paso = 0;
  
  
  estadoJuego.secuenciaJuego.push(obtenerElementoAleatorio().id);
  estadoJuego.nivelJuego = estadoJuego.nivelJuego + 1;


  
  const intervalo = setInterval(() => {
    
    const pausaPaso = paso % 2 === 1;
    
    const finReprodduccion = paso === (estadoJuego.secuenciaJuego.length * 2);

    if (pausaPaso) {
     
      desactivarElementos(botonesDelJuego);
     
      paso++;

      return;
    }

    if (finReprodduccion) {

      clearInterval(intervalo);
      
      desactivarElementos(botonesDelJuego);
      
      activarInteracciones();

      return;
    }
    const id = estadoJuego.secuenciaJuego[paso / 2];
    const referenciaDOM = obtenerElementoDom(id);
    activarElemento(referenciaDOM)
    paso++;
  }, estadoJuego.intervalos.paso);
};

/**
 * Función de inicialización del juego
 */

const inicializacion = () => {
  
  let segundosInicio = estadoJuego.segundosInicio;

  estadoJuego.secuenciaJuego = [];
  estadoJuego.secuenciaUsuario = [];
  estadoJuego.nivelJuego = 0;
  estadoJuego.nivelUsuario = 0;
  
  const elementoJuego = obtenerElementoDom("juego");
  mostrarElemento(elementoJuego);

  const elementoCuentaRegresiva = obtenerElementoDom("cuenta_regresiva");
  mostrarElemento(elementoCuentaRegresiva);
  elementoCuentaRegresiva.textContent = segundosInicio;
  
  const intervalo = setInterval(() => {
    segundosInicio--;

    elementoCuentaRegresiva.textContent = segundosInicio;

    if (segundosInicio === 0) {
      ocultarElemento(elementoCuentaRegresiva);
      reproducirSecuencia();
      clearInterval(intervalo);
    }
  }, estadoJuego.intervalos.inicio);
};

const nombreJugadorStorage = window.localStorage.getItem("nombre");
const elementoNombre = obtenerElementoDom("nombre_jugador");
elementoNombre.value = nombreJugadorStorage || "";

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