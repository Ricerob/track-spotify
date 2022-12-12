import './App.css';

export default function TrackPanel(track_info) {
    //console.log(track_info.track_info)
    return (
        <>
            <div className='track-pane'>
                <div className='inter-track'>
                    <img className='track-img' src={track_info.track_info.img} alt="album cover"/>
                    <div className='text-info'>
                        <div className='top-text'>
                            <h3>{track_info.track_info.track_name}</h3>
                            <h3>Release: {track_info.track_info.date_released}</h3>
                        </div>
                        <h4>{track_info.track_info.artists.join(", ")}</h4>
                    </div>
                </div>
            </div>
        </>
    )
}