export default async function grabTracks(artist_id, accessToken) {
    const response = await fetch(`https://api.spotify.com/v1/artists/${artist_id}/albums?limit=4`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    const data = await response.json()

    if(data.error) {
        console.log(data)
        return false
    }
    else {
        return data["items"]
    }
}