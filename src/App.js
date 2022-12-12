import { useState, useEffect } from 'react';
import './App.css';
import checkIfValid from './api/checkIfValid';

function App() {
  const [hasArtists, setHasArtists] = useState(false);
  const [artists, setArtists] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  const [artistsData, setArtistsData] = useState([])

  const secret = process.env.REACT_APP_SECRET
  const client_id = process.env.REACT_APP_CLIENT_ID
  const credentials = btoa(`${client_id}:${secret}`);

  require('dotenv').config();

  useEffect(() => {
    async function fetchToken() {
      await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:'grant_type=client_credentials'
    })
        .then(response => response.json())
        .then(data => {
            setAccessToken(data.access_token)
        });
    }
    fetchToken()

    const storedArtists = localStorage.getItem('artists');
    if (storedArtists) {
      setArtists(JSON.parse(storedArtists));
      setHasArtists(true);
    }
    else {
      setHasArtists(false);
    }
  }, []);

  async function handleClick() {
    const input = document.getElementById('artist-input').value;
    if(artists.includes(input)) {
      alert(input + ' already added.')
    } 
    else if(!input || input.trim() === '') {
      alert('Error in input')
    }
    else {
      const valid = await checkIfValid(input, accessToken);
      if(!valid) {
        alert(input + ' is not a valid artist ID.')
      }
      else {
        setArtists([...artists, input.trim()])
        localStorage.setItem('artists', JSON.stringify([...artists, input.trim()]))
      }
    }
  }

  function collectArtistData(artist_data) {

  }

  function removeArtist(index) {
    const updatedArtists = artists.filter((i) => i !== index);
    setArtists(updatedArtists);
    localStorage.setItem('artists', updatedArtists)
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
            {artists.map((artist, index) => {
              return(
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
            
        </div>
      </div>
    </div>
  );
}

export default App;
