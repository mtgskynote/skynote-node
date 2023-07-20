import violinBKG from "../assets/images/violinBKG.jpeg";

const ViolinBKG = ({ height, width }) => {
  return (
    <img
      src={violinBKG}
      className="violinBKGgo"
      altprop="violin-background"
      height={height}
      width={width}
    />
  );
};

export default ViolinBKG;
