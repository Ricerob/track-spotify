import './App.css';

export default function TrackPanel(track_info) {
    const releaseDate = new Date(track_info.track_info.date_released);
    const currentDate = new Date();
    const twoWeeks = 14 * 24 * 60 * 60 * 1000; // two weeks in milliseconds
    const withinTwoWeeks = currentDate - releaseDate < twoWeeks;
  
    return (
      <>
        <div
          className={`track-pane${withinTwoWeeks ? " special-border" : ""}`}
        >
          <div className="inter-track">
            <img
              className="track-img"
              src={track_info.track_info.img}
              alt="album cover"
            />
            <div className="text-info">
              <div className="top-text">
                <h3>{track_info.track_info.track_name}</h3>
                <h3>Release: {track_info.track_info.date_released}</h3>
              </div>
              <h4>{track_info.track_info.artists.join(", ")}</h4>
            </div>
          </div>
        </div>
      </>
    );
  }
  