
const lblEscritorio = document.querySelector('h1');     //el primer h1 que encuentre
const btnAtender    = document.querySelector('button')  //el primer button que ecuentre
const lblTicket     = document.querySelector('small')
const divAlerta     = document.querySelector('.alert')
const lblPendientes = document.querySelector('#lblPendientes')

//Leer los parametros del URL
const searchParams = new URLSearchParams(window.location.search);

//Si no está el parametro escritorio, dar error y volver al index
if (!searchParams.has('escritorio')){
    window.location='index.html';
    throw new Error('El escritorio es obligatorio')
}

const escritorio=searchParams.get('escritorio');
lblEscritorio.innerHTML = escritorio;

divAlerta.style.display='none'
const socket = io();

socket.on('connect', () => {
    btnAtender.disabled = false;      //Servidor online activamos el boton
});

socket.on('disconnect', () => {
    btnAtender.disabled = true;       //Servidor offline desactivamos el boton
});

socket.on('tickets-pendientes', (pendientes) => {
    
    if(pendientes===0){
        lblPendientes.style.display='none'
    }else{
        lblPendientes.style.display='';
    }
    lblPendientes.innerHTML=pendientes
});


btnAtender.addEventListener( 'click', () => {            
    
    socket.emit( 'atender-ticket', {escritorio}, ( {ok,ticket,msg} ) => {  //emito evento al backend, el backend trae el metodo nuevo-ticket
        
        if(!ok){  //el backend me retorna ok si hay ticket por atender
            lblTicket.innerText='nadie'     
            return divAlerta.style.display='';
        }

        lblTicket.innerText='Ticket '+ ticket.numero //muestro en el front        
        console.log('Desde el server', ticket );
    });
});



