
const TicketControl = require('../models/ticket-control')
const ticketControl = new TicketControl()

const socketController = (socket) => {
    
    //Cuadno un cliente se conecta
    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('estado-actual', ticketControl.ultimos4)
    socket.emit('tickets-pendientes', ticketControl.tickets.length)


    console.log('los ultimos 4 son',ticketControl.ultimos4)


    socket.on('disconnect', () => {
    });

    socket.on('siguiente-ticket', ( payload, callback ) => {
        
       const siguiente = ticketControl.siguiente();
       socket.broadcast.emit('tickets-pendientes',ticketControl.tickets.length)    //Emite al cliente que hizo el cambio

       callback(siguiente);
       
       // TODU : notificar que hay un nuevo ticket pendiente por asignar
    })






    socket.on('atender-ticket', ( payload, callback ) => {
       
        if(!payload.escritorio){              //payload es tipo Ticket, debe de tener numero y escritorio
            return callback({
                ok: false,
                msg: 'El escritorio es obligadorio'
            })
        }
        
        const ticket = ticketControl.atenderTicket(payload.escritorio) //obtener el ticket a atender 
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4)
        
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

