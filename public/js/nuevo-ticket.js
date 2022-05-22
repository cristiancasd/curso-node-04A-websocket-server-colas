const lblNuevoTicket = document.querySelector('#lblNuevoTicket')
const btnCrear = document.querySelector('button')


const socket = io();

socket.on('connect', () => {
    // console.log('Conectado');
    btnCrear.disabled = false;      //Servidor online activamos el boton
});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    btnCrear.disabled = true;       //Servidor offline desactivamos el boton
});

btnCrear.addEventListener( 'click', () => {            
    socket.emit( 'siguiente-ticket', null, ( ticket ) => {  //emito evento al backend, el backend trae el metodo nuevo-ticket
        console.log('Desde el server', ticket );
        lblNuevoTicket.innerHTML = ticket;              //Muestro en la pantalla el valor del nuevo ticket (nuevo-ticket.html)
    });
});

socket.on('ultimo-ticket', (ticket) => {
    lblNuevoTicket.innerHTML = 'Ticket '+ticket;
})

