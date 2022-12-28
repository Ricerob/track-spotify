
// Call for search
export default async function checkIfValid(id, access_token) {
    id = id.replace(" ", "%20");
    var artistId = ''
    var name = ''
    console.log(`Searching for ${id}`)
    const url = `https://api.spotify.com/v1/search?q=${id}&type=artist&limit=2`

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
            console.log(data)
            if (data.error || data.artists.items.length === 0) {
                console.log(`Error in grabbing data`)
                return false
            }
            else {
                name = data.artists.items[0].name;
                artistId = data.artists.items[0].id;
                console.log(`Successful ID grab, ${artistId} for ${id}`)
                artistId = artistId
            }
        })
    return {"artistId": artistId, "name": name}
};