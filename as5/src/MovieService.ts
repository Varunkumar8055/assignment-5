type Movie = {
  id: string;
  title: string;
  director: string;
  releaseYear: number;
  genre: string;
  rating: number[];
};

class MovieDatabase {
  private movies: Map<string, Movie> = new Map();

  addMovie(id: string, title: string, director: string, releaseYear: number, genre: string): string {
    if (this.movies.has(id)) {
      console.log("Movie ID already exists.");
      return "Movie ID already exists";
    }

    const movie: Movie = {
      id,
      title,
      director,
      releaseYear,
      genre,
      rating: [],
    };

    this.movies.set(id, movie);
    console.log("Movie added successfully");
    return id;
  }

  rateMovie(id: string, rating: number): void {
    const movie = this.movies.get(id);
    if (!movie) {
      console.log("Movie not found");
      return;
    }

    if (rating < 0 || rating > 10) {
      console.log("Rating should be between 0 and 10.");
      return;
    }

    movie.rating.push(rating);
    console.log(`Movie: ${movie.title} has been rated ${rating}`);
  }

  getAverageRating(id: string): number | null {
    const movie = this.movies.get(id);
    if (!movie) return null;
    if (movie.rating.length === 0) return 0;

    const sum = movie.rating.reduce((total, rating) => total + rating, 0);
    return sum / movie.rating.length;
  }

  getMovie(id: string): Movie | null {
    return this.movies.get(id) || null;
  }

  removeMovie(id: string): void {
    if (this.movies.delete(id)) {
      console.log("Movie removed successfully");
    } else {
      console.log("Movie not found");
    }
  }

  getTopRatedMovies(): Movie[] {
    return Array.from(this.movies.values())
      .filter((movie) => movie.rating.length > 0)
      .sort((a, b) => {
        const avgA = this.getAverageRating(a.id) || 0;
        const avgB = this.getAverageRating(b.id) || 0;
        return avgB - avgA; // Descending order
      });
  }

  getMoviesByGenre(genre: string): Movie[] {
    return Array.from(this.movies.values()).filter(
      (movie) => movie.genre.toLowerCase() === genre.toLowerCase()
    );
  }

  getMoviesByDirector(director: string): Movie[] {
    return Array.from(this.movies.values()).filter(
      (movie) => movie.director.toLowerCase() === director.toLowerCase()
    );
  }

  searchMoviesBasedOnKeyword(keyword: string): Movie[] {
    return Array.from(this.movies.values()).filter((movie) =>
      movie.title.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  getAllMovies(): Movie[] {
    return Array.from(this.movies.values());
  }
}

export default MovieDatabase;
