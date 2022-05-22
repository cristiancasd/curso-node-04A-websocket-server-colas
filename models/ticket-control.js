const path = require('path')
const fs   = require('fs')

class Ticket {
    constructor(numero, escritorio){
        this.numero=numero
        this.escritorio=escritorio
    }
}


class TicketControl{
    
    constructor(){
        this.ultimo   = 0;
        this.hoy      = new Date().getDate();
        this.tickets  = [];
        this.ultimos4 = [];

        this.init();
    }


    get toJson() {
        return{
            ultimo : this.ultimo,
            hoy : this.hoy,
            tickets : this.tickets,
            ultimos4 : this.ultimos4
        }
    }

    init(){
        console.log('estoy en el init')
        const {hoy,tickets,ultimo,ultimos4 } = require('../db/data.json')

        //Confirmo si la base de datos es de hoy
        if(hoy===this.hoy){                 //Usar los datos de la base de datos
            this.tickets  = tickets;
            this.ultimo   = ultimo;
            this.ultimos4 = ultimos4
        }else{
            //es otro día
            this.guardarDB();               //Sobre escribir en la db los datos asiganados en el constructor
        }
    }

    guardarDB(){
        const dbPath = path.join(__dirname,'../db/data.json')
        fs.writeFileSync(dbPath,JSON.stringify(this.toJson))
    }

    siguiente(){
        this.ultimo += 1;
        const ticket = new Ticket(this.ultimo,null);    //Creo una variable clase Ticket 
        this.tickets.push(ticket);                      //Agrego al arreglo el ticket creado
        this.guardarDB();                               //Guardo en db El arreglo 
        return 'Ticket' + ticket.numero                 //Retorno el numero del ticket
    }

    atenderTicket(escritorio){          // Escritorio es el que va a atender un ticket respectivo
        
        if(this.tickets.length===0){    //Si no tenemos tickets por atender
            console.log('no hay ticket por atender')
            return null;
        }

        const ticket = this.tickets.shift(); //remueve el primer elemento del arreglo y lo retorna (se borra el ticket del arreglo ya que no está pendiente)
        ticket.escritorio=escritorio;        //es clase Ticket, tiene numero y escritorio
        this.ultimos4.unshift(ticket)        //añadir un elemento nuevo al arreglo, al inicio (son los tickets en pantalla)
        
        if(this.ultimos4.length>4){
            this.ultimos4.splice(-1,1)      //-1 es ultima posición del arreglo  y 1 es cortar un elemento 
        }

        this.guardarDB()

        return ticket;
    }
}

module.exports=TicketControl
