class AudioRequest{
    constructor(path){
        this.audio = new CustomEvent("audiocall", {
            detail: path,
        });

        this.send();
    }

    send(){
        window.dispatchEvent(this.audio);
    }
}