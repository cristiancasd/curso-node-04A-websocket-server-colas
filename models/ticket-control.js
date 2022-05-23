const path = require('path')
const fs   = require('fs')

class Ticket {           //Modelo ticket, cada objeto tiene un valor, y un escritorio
    constructor(numero, escritorio){
        this.numero=numero
        this.escritorio=escritorio
    }
}

class TicketControl{    //Modelo controlar tickets. Inicializa        
    constructor(){
        this.ultimo   = 0;
        this.hoy      = new Date().getDate();
        this.tickets  = [];
        this.ultimos4 = [];
        this.init();
    }

    init(){
        const {hoy,tickets,ultimo,ultimos4 } = require('../db/data.json') //traigo los datos de db

        //Confirmo si la base de datos es de hoy
        if(hoy===this.hoy){         //Usar los datos de la base de datos
            this.tickets  = tickets;
            this.ultimo   = ultimo;
            this.ultimos4 = ultimos4
        }else{
            //es otro día
            this.guardarDB();       //Sobre escribir en la db los datos asiganados en el constructor
        }
    }

    get toJson() {
        return{
            ultimo : this.ultimo,
            hoy : this.hoy,
            tickets : this.tickets,
            ultimos4 : this.ultimos4
        }
    }  

    guardarDB(){    //SobreEscribir el db con los datos actuales de la app
        const dbPath = path.join(__dirname,'../db/data.json')
        fs.writeFileSync(dbPath,JSON.stringify(this.toJson))
    }

    siguiente(){     //Crear un nuevo ticket
        this.ultimo += 1;  
        const ticket = new Ticket(this.ultimo,null);    //Creo una variable clase Ticket 
        this.tickets.push(ticket);                      //Agrego al arreglo el ticket creado
        this.guardarDB();                               //Guardo en db El arreglo 
        return 'Ticket' + ticket.numero                 //Retorno el numero del ticket
    }

    atenderTicket(escritorio){    // Asignar ticket al escritorio que hace la solicitud
        
        if(this.tickets.length===0){    //Si no tenemos tickets por atender
            console.log('no hay ticket por atender')
            return null;
        }

        const ticket = this.tickets.shift(); //remueve el primer elemento del arreglo y lo retorna (se borra el ticket del arreglo ya que no está pendiente)
        ticket.escritorio=escritorio;        //es clase Ticket, tiene numero y escritorio

        //Recorre el arreglo revisando si hay un espacio con un ticket ya atendido por ese escritorio y lo elimina
        this.ultimos4.forEach((escritorio, index) => {  
            console.log('index ',index, '  Escritorio ... ',escritorio.escritorio);
            if(ticket.escritorio == escritorio.escritorio){   
                this.ultimos4.splice(index,1);
            }
        });

        this.ultimos4.unshift(ticket)        //añadir un elemento nuevo al arreglo, al inicio (son los tickets en pantalla)      
        
        if(this.ultimos4.length>4){
            this.ultimos4.splice(-1,1)      //-1 es ultima posición del arreglo  y 1 es cortar un elemento 
        }
        this.guardarDB()
        return ticket;     
    }
}

module.exports=TicketControl
