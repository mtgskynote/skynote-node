import musictech from "../assets/images/musictech.jpg";
const MusicTech = ({ height, width }) => {
  return (
    <img
      src={musictech}
      className="music-tech"
      altprop="music-tech"
      height={height}
      width={width}
    />
  );
};

export default MusicTech;