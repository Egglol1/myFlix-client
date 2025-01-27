import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import './movie-view.scss';

export const MovieView = ({ movie }) => {
  const { movieId } = useParams();

  movie = movie.find((m) => m.id === movieId);

  return (
    <div>
      <div>
        <img width="425" height="550" src={movie.image} />
      </div>
      <div>
        <span>Title: </span>
        <span>{movie.title}</span>
      </div>
      <div>
        <span>Director: </span>
        <span>{movie.director}</span>
      </div>
      <div>
        <span>Description: </span>
        <span>{movie.description}</span>
      </div>
      <div>
        <span>Genre: </span>
        <span>{movie.genre}</span>
      </div>
      <Link to={`/`}>
        <button className="back-button">Back</button>
      </Link>
    </div>
  );
};
