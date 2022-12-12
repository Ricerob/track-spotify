import { useState, useEffect } from 'react';
import './App.css';
import checkIfValid from './api/checkIfValid';
import grabTracks from './api/grabTracks';
import TrackPanel from './trackPanel';
require('dotenv').config();

function App() {
  const [hasArtists, setHasArtists] = useState(false);
  const [artists, setArtists] = useState([]);
  const [artistsNames, setArtistsNames] = useState([])
  const [accessToken, setAccessToken] = useState('');
  const [tracks, setTracks] = useState([])
  require('dotenv').config();

  useEffect(() => {

    async function fetchToken() {
      const credentials = btoa(`${process.env.REACT_APP_SECRET}:${process.env.REACT_APP_CLIENT_ID}`);

      await fetch('https://accounts.spotify.com/api/token', {
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
        });
    }
    fetchToken()

    const storedArtists = localStorage.getItem('artists');
    const storedArtistsNames = localStorage.getItem('artistsNames');
    if(storedArtists){
      setArtists(JSON.parse(storedArtists));
      setArtistsNames(JSON.parse(storedArtistsNames));
      setHasArtists(true);
    }
    else {
      setHasArtists(false);
    }

  }, []);

  async function handleClick() {
    const input = document.getElementById('artist-input').value;
    if (artists.includes(input)) {
      alert(input + ' already added.')
    }
    else if (!input || input.trim() === '') {
      alert('Error in input')
    }
    else {
      const valid = await checkIfValid(input, accessToken);
      if (!valid) {
        alert(input + ' is not a valid artist ID.')
      }
      else {
        setArtists([...artists, input.trim()])
        setArtistsNames([...artistsNames, valid.name])
        if(!hasArtists) setHasArtists(true);
        localStorage.setItem('artists', JSON.stringify([...artists, input.trim()]))
        localStorage.setItem('artistsNames', JSON.stringify([...artistsNames, valid.name]))
        //await populateTracks(input.trim())
      }
    }
  }

  function parseArtists(artists_list){
    var artistsArray = []
    artists_list.forEach(artist => {
      artistsArray.push(artist.name)
    })
    return artistsArray
  }

  // Grabs a single artist's tracks, sets 
  async function populateTracks(artist_id) {
    const tracksRet = await grabTracks(artist_id, accessToken)
    if (!tracksRet) {
      console.log('error in grabbing tracks')
    }
    else {
      tracksRet.forEach(track => {
        var trackInfo = {
          'artists': parseArtists(track.artists),
          'track_name': track.name,
          'img': track.images[2].url,
          'link': track.external_urls.spotify,
          'date_released': track.release_date
        }
        setTracks(prevTracks => [...prevTracks, trackInfo])
      });
    }
  }

  function renderTracks() {
    if(tracks) setTracks([])
    artists.forEach(async artist => {
      await populateTracks(artist)
    })

    const sortedTrackList = () => {
      return tracks.sort((a, b) => {
        return new Date(b.date_released) - new Date(a.date_released)
      })
    }
    setTracks(sortedTrackList)
  }

  function removeArtist(index) {
    const updatedArtists = artists.filter((i) => i !== index);
    const updatedArtistsNames = artistsNames.filter((i) => i !== index); 
    setArtists(updatedArtists);
    setArtistsNames(updatedArtistsNames)
    localStorage.setItem('artists', updatedArtists)
    localStorage.setItem('artistsNames', updatedArtistsNames)
    if(updatedArtists.length === 0) setHasArtists(false)
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
            {artistsNames.map((artist, index) => {
              return (
                <li className='artist-list-item' onClick={() => removeArtist(artist)}>{artist}</li>)
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
          <button onClick={async () => await renderTracks()}>Render Releases</button>
          {tracks.map((track, i) => {
            return(<TrackPanel track_info={track}/>)
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
