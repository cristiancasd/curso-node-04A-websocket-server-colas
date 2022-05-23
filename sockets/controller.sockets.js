
// Es el backend

const TicketControl = require('../models/ticket-control')   
const ticketControl = new TicketControl() //Con esto inicializo la base de datos

const socketController = (socket) => {        //Cuando un cliente se conecta

    socket.emit('ultimo-ticket', ticketControl.ultimo);              //Se usa en nuevo-ticket.js 
    socket.emit('estado-actual', ticketControl.ultimos4);            //Se usa en publico
    socket.emit('tickets-pendientes', ticketControl.tickets.length); //Se usa en escritorio


    socket.on('disconnect', () => {
    });

    socket.on('siguiente-ticket', ( payload, callback ) => {        //Ejecuto cuando un cliente solicita un nuevo ticket
       const siguiente = ticketControl.siguiente();
       socket.broadcast.emit('tickets-pendientes',ticketControl.tickets.length)    //Emite al cliente que hizo el cambio
       callback(siguiente);       
    })

    socket.on('atender-ticket', ( payload, callback ) => {  //Ejecuto cuando en escritorio necesitan atender un nuevo ticket       
        if(!payload.escritorio){              //payload fue enviado como un objeto con una propiedad escritorio
            return callback({
                ok: false,
                msg: 'El escritorio es obligadorio'
            })
        }
        
        const ticket = ticketControl.atenderTicket(payload.escritorio) //obtener el ticket a atender 
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4) //emito actualización de los tickets en pantalla a todos los clientes
        //Saber la cantidad de tickets por enviar 
        socket.emit('tickets-pendientes',ticketControl.tickets.length)              //Emite a todos los clientes menmos el cliente del cambio
        socket.broadcast.emit('tickets-pendientes',ticketControl.tickets.length)    //Emite al cliente que hizo el cambio

        if (!ticket){       
            callback({
                ok:  false,
                msg: 'Ya no hay tickets pendientes'
            })
        }else{
            callback({
                ok: true,
                ticket
            })
        }
    })    
}

module.exports = {
    socketController
}

