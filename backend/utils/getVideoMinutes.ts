export function getVideoMinutes(data:string){
    const indexM:number = data.indexOf("M")
    
    const minute = data[indexM - 1]
    return minute
   
}