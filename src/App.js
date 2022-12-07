import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [hasArtists, setHasArtists] = useState(false);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const storedArtists = localStorage.getItem('artists');
    if (storedArtists) {
      setArtists(JSON.parse(storedArtists));
      setHasArtists(true);
    }
    else {
      setHasArtists(false);
    }
    console.log(artists)
  }, []);

  useEffect(() => {
    localStorage.setItem('artists', JSON.stringify(artists));
  }, [artists]);

  function handleClick() {
    const input = document.getElementById('artist-input').value;
    if(artists.includes(input)) {
      alert(input + ' already added.')
    } 
    else if(!input || input.trim() === '') {
      alert('Error in input')
    }
    else {
     setArtists([...artists, input.trim()])
    }
  }

  function removeArtist(index) {
    const updatedArtists = artists.filter((artist, i) => i !== index);
    setArtists(updatedArtists);
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
                <li className='artist-list-item' onClick={() => removeArtist(index)}>{artist}</li>)
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
