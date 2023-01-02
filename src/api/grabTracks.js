export default async function grabTracks(artist_id, accessToken) {
    const singleData = await fetch(`https://api.spotify.com/v1/artists/${artist_id}/albums?include_groups=single%2Cappears_on&limit=3`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    const data = await singleData.json()

    if(data.error) {
        console.log(data)
        return false
    }

    const albumData = await fetch(`https://api.spotify.com/v1/artists/${artist_id}/albums?include_groups=album&limit=2`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    const dataAlbum = await albumData.json()

    if(dataAlbum.error) {
        console.log(dataAlbum)
        return false
    }

    const allData = Array.from(new Set([].concat(data["items"], dataAlbum["items"])))
    return allData
}