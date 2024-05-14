
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export function FetchWithToken(body: string,URL: string) {
    const userToken = localStorage.getItem("userToken");
    const token = userToken ? JSON.parse(userToken) : null;
    return  fetch(BACKEND_URL + URL, {
                method: "POST",
                headers:    { 
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + token
                            },
                            body: body,
                })
            .then(response => { 
                console.log("fetch response: ", response)
                return response.json();})
            .catch((error) => alert("Error logging in: " + error));
}