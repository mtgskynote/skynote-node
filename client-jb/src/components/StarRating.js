import React from 'react'
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'

const StarRating = ({ stars, size }) => {
  const renderStars = () => {
    const filledStars = []
    const emptyStars = []

    for (let i = 0; i < stars; i++) {
      filledStars.push(
        <StarRateRoundedIcon
          key={i}
          className={`text-yellow-300 ${size ? size : 'text-4xl'}`}
        />
      )
    }

    for (let i = stars; i < 3; i++) {
      emptyStars.push(
        <StarBorderRoundedIcon
          key={i}
          className={`text-yellow-300 ${size ? size : 'text-4xl'}`}
        />
      )
    }

    return (
      <>
        {filledStars}
        {emptyStars}
      </>
    )
  }

  return <div className="flex items-center">{renderStars()}</div>
}

export default StarRating
