import { useState, useEffect } from 'react';
import './App.css';
import checkIfValid from './api/checkIfValid';
import grabTracks from './api/grabTracks';
import grabName from './api/grabName';
import TrackPanel from './trackPanel';
require('dotenv').config();

function App() {
  const [hasArtists, setHasArtists] = useState(false);
  const [artists, setArtists] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  const [tracks, setTracks] = useState([])
  const [sortedTracks, setSortedTracks] = useState([])
  const [artistsMapping, setArtistsMapping] = useState([]);
  require('dotenv').config();

  useEffect(() => {

    async function fetchToken() {
      const credentials = btoa(`${process.env.REACT_APP_CLIENT_ID}:${process.env.REACT_APP_SECRET}`);

      const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials'
      })
        .then(response => response.json())
        .then(data => {
          setAccessToken(data.access_token)

          var storedArtists = localStorage.getItem('artists');
          if (storedArtists) {
            if (storedArtists[0] !== "[") {
              storedArtists = `["${storedArtists}"]`
            }
            setArtists(JSON.parse(storedArtists));
            setHasArtists(true);

            JSON.parse(storedArtists).forEach(async (artist) => {
              const ret = await grabName(artist, data.access_token);
              if (!ret) {
                alert(artist + ' returned no naming results.')
              }
              else {
                const newMap = { "artistId": artist, "name": ret }
                setArtistsMapping(prevArtistsMapping => [...prevArtistsMapping, newMap])
              }
            })
          }
          else {
            setHasArtists(false);
          }
        });
    }
    fetchToken()

  }, []);

  async function handleClick() {
    if (!accessToken) {
      console.log("No access token - cannot populate tracks")
      return false
    }

    const input = document.getElementById('artist-input').value;
    if (artists.includes(input)) {
      alert(input + ' already added.')
    }
    else if (!input || input.trim() === '') {
      alert('Error in input')
    }
    else {
      const ret = await checkIfValid(input, accessToken)
      if (!ret) {
        alert(input + ' returned no search results.')
      }
      else {
        console.log('returned from checkIfValid with ID' + ret.artistId)
        setArtists([...artists, ret.artistId])
        setArtistsMapping([...artistsMapping, ret])
        console.log(artistsMapping)
        if (!hasArtists) setHasArtists(true);
        localStorage.setItem('artists', JSON.stringify([...artists, ret.artistId]))
      }
    }
  }

  function parseArtists(artists_list) {
    var artistsArray = []
    artists_list.forEach(artist => {
      artistsArray.push(artist.name)
    })
    return artistsArray
  }

  // Grabs a single artist's tracks, sets 
  async function populateTracks(artist_id) {
    if (!accessToken) {
      console.log("No access token - cannot populate tracks")
      return false
    }
    const tracksRet = await grabTracks(artist_id, accessToken)
    if (!tracksRet) {
      console.log('error in grabbing tracks')
    }
    else {
      let soonTracks = []
      tracksRet.forEach((track, i) => {
        var trackInfo = {
          'artists': parseArtists(track.artists),
          'track_name': track.name,
          'img': track.images[2].url,
          'link': track.external_urls.spotify,
          'date_released': track.release_date
        }
        soonTracks.push(trackInfo)
      });
      return soonTracks
    }
  }

  async function populateArtistsTracks() {
    setTracks([])
    let artistTracks = []

    for (let i = 0; i < artists.length; i++) {
      let ret = await populateTracks(artists[i]);
      artistTracks.push(ret)
    }

    setTracks(artistTracks.flat())

    let sorted = artistTracks.flat().sort((a, b) => {
      if (a.date_released < b.date_released) {
        return 1;
      } else if (a.date_released > b.date_released) {
        return -1;
      } else {
        return 0;
      }
    });
    setSortedTracks(sorted.flat())
  }

  async function removeArtist(index) {
    const updatedArtists = artists.filter((i) => i !== index);
    const updatedArtistsMapping = artistsMapping.filter((i) => i.artistId !== index);
    setArtists(updatedArtists);
    setArtistsMapping(updatedArtistsMapping);
    localStorage.setItem('artists', updatedArtists)
    if (updatedArtists.length === 0) setHasArtists(false)
    else await populateArtistsTracks()
  }

  return (
    <div className="App">
      <div className='left-pane'>
        {/* Adding pane */}
        <div className='add-artist'>
          <p>Add Artist</p>
          <input id='artist-input' type='text' />
          <button onClick={() => handleClick()}>Add artist</button>
        </div>
        {/* Added artists */}
        <div className='view-artists'>
          <ul>
            {artistsMapping && artistsMapping.map((artist, index) => {
              return (
                <li className='artist-list-item' onClick={async () => await removeArtist(artist.artistId)}>{artist.name}</li>)
            })}
          </ul>
        </div>
      </div>
      {/* Track List */}
      <div className='right-pane'>
        {hasArtists && <h2>Recent Releases</h2>}
        {!hasArtists && <h2>Add an artist to get started!</h2>}
        {/* Scrollable Pane */}
        <div className='artist-list'>
          <button className='render-button' onClick={async () => { await populateArtistsTracks(); }
          }>Render Releases</button>
          <ul>
            {sortedTracks && sortedTracks.map((track) => {
              return <TrackPanel track_info={track} />
              // <p>{track.date_released}</p>
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
