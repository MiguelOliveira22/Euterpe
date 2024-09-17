class TabelaRequest{
    constructor(namevent){
        this.table = new Event(namevent);
    }

    send(){
        window.dispatchEvent(this.table);
    }
}