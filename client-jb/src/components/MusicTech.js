import musictech from "../assets/images/musictech.jpg";
const MusicTech = ({ height, width }) => {
  return (
    <img
      src={musictech}
      className="music-tech"
      altprop="music-tech"
      style={{ width: '100vw', height: '600px' }}
    />
  );
};

export default MusicTech;