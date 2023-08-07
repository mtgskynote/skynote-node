import background_image  from "../assets/images/violin/violin7.png";

const BackgroundImage = ({ height, width }) => {
  return (
    <img
      src={background_image}
      className="background-image"
      altprop="background-image"
      height={height}
      width={width}
    />
  );
};

export default BackgroundImage;