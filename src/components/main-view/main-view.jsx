import { useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
  const [movies, setMovies] = useState([
    {
      id: 1,
      title: "Bullet Train",
      image:
        "https://en.wikipedia.org/wiki/Bullet_Train_(film)#/media/File:Bullet_Train_(poster).jpeg",
      director: "David Leitch",
      description: "Bullet Train is an action film directed by David Leitch. Centered around a group of assassins on the JR Central Shinkansen that end up in conflict with each other.",
      genre: "Action"
    },
    {
      id: 2,
      title: "Evil Dead II",
      image:
        "https://en.wikipedia.org/wiki/Evil_Dead_II#/media/File:Evil_Dead_II_poster.jpg",
      director: "Sam Raimi",
      description: "Evil Dead II is a 1987 American comedy horror film directed by Sam Raimi, who co-wrote it with Scott Spiegel. The second installment in the Evil Dead film series, it is considered both a remake and sequel to The Evil Dead.",
      genre: "Horror"
    },
    {
      id: 3,
      title: "The Thing",
      image:
        "https://en.wikipedia.org/wiki/The_Thing_(1982_film)#/media/File:The_Thing_(1982_film).png",
      director: "John Carpenter",
      description: "The Thing is a 1982 American science fiction horror film directed by John Carpenter from a screenplay by Bill Lancaster. Based on the 1938 John W. Campbell Jr. novella Who Goes There?, it tells the story of a group of American researchers in Antarctica who encounter the eponymous 'Thing', an extraterrestrial life-form that assimilates, then imitates, other organisms.",
      genre: "Horror"
    },
    {
      id: 4,
      title: "The Avengers",
      image:
        "https://en.wikipedia.org/wiki/The_Avengers_(2012_film)#/media/File:The_Avengers_(2012_film)_poster.jpg",
      director: "Joss Whedon",
      description: "Marvel's The Avengers is a 2012 American superhero film based on the Marvel Comics superhero team of the same name.",
      genre: "Action"
    },
    {
      id: 5,
      title: "Lord of the Rings: The Fellowship of the Ring",
      image:
        "https://en.wikipedia.org/wiki/The_Lord_of_the_Rings:_The_Fellowship_of_the_Ring#/media/File:Lord_Rings_Fellowship_Ring.jpg",
      director: "Peter Jackson",
      description: "The Lord of the Rings: The Fellowship of the Ring is a 2001 epic high fantasy adventure film directed by Peter Jackson based on 1954's The Fellowship of the Ring, the first volume of the novel The Lord of the Rings by J. R. R. Tolkien. The film is the first installment in The Lord of the Rings trilogy.",
      genre: "Fantasy"
    },
  ]);

  const [selectedMovie, setSelectedMovie] = useState(null);
  if (selectedMovie) {
    return (
      <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
    );
  }

  if (movies.length === 0) {
    return <div>The list is empty!</div>;
  }

  return (
    <div>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onMovieClick={(newSelectedMovie) => {
            setSelectedMovie(newSelectedMovie);
          }}
        />
      ))}
    </div>
  );
};
