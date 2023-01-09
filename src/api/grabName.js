export default async function grabName(id, access_token) {
    const url = `https://api.spotify.com/v1/artists/${id}`
    var name = ''

    await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
            'Accept': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.log(`Error in grabbing data`)
                return false
            }
            else {
                name = data.name;
            }
        })
    return name
}