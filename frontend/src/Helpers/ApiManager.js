const localIP = "192.168.0.250";
const ApiDomain = `http://${localIP}:5000/`


export default async function ApiRequest(endpoint, method, body=null,auth=true) { 
    try {

        var headers = null 
        if (auth) {
        const token = localStorage.getItem("token");
        headers = {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
            }   
        }else{
        headers = {
                    "Content-Type": "application/json",
            }
        }


        const respose = await fetch(ApiDomain + endpoint, {
            method: method,
            headers: headers,
            body: body
        }
    )
    return respose;
    } catch(error) {
        console.error("Sunucu hatası: ", error);
        alert("Sunucu hatası")
    }

}

//export default async ApiRequest()

