// DO NOT PUSH UNTIL USING NODE ENV

// Call https://api.spotify.com/v1/artists/test1, if 400 return false
export default async function checkIfValid(id, access_token) {

    const response = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        }
    });
    const data = await response.json();

    if(data.error) {
        return false
    }
    return data
};