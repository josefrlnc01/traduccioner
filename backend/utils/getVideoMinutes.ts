export function getVideoMinutes(data:string){
    const indexM:number = data.indexOf("M")
    console.log(data)
    const minute = data[indexM - 1]

    //Si el formato pthms tiene mas de 7 caracteres es mayor a 10 min y no continuamos el flujo normal
    if (data.length > 7) {
        throw new Error("Video demasiado largo")
    } else {
        return minute
    }
}