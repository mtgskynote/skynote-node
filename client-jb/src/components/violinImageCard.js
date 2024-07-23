import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ViolinCard = ({ violinImg, subfolder, ButtonText }) => {
  return (
    <Card style={{ width: '500px', margin: '1.2rem' }}>
      <Card.Img
        variant="top"
        src={violinImg}
        style={{
          width: '100%',
          height: '50%',
          objectFit: 'contain',
        }}
      />
      <Card.Body style={{ height: '100px' }}>
        <Card.Title>
          <div className="center">
            <Button
              variant="primary"
              as={Link}
              to={subfolder}
              style={{ marginTop: '1.2rem' }}
            >
              {ButtonText}
            </Button>
          </div>
        </Card.Title>
        <Card.Text></Card.Text>
      </Card.Body>
    </Card>
  );
};

ViolinCard.propTypes = {
  violinImg: PropTypes.string.isRequired,
  subfolder: PropTypes.string.isRequired,
  ButtonText: PropTypes.string.isRequired,
};

export default ViolinCard;
