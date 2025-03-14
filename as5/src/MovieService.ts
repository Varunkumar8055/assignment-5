interface Movie {
    id: string
    title: string
    director: string
    releaseYear: number
    genre: string
    ratings: number[]
  }
  
  export class MovieService {
    private movies: Movie[] = []
  
    addMovie(movie: Movie): Movie | null {
      if (!movie.id || !movie.title || !movie.director || !movie.releaseYear || !movie.genre) {
        return null
      }
      this.movies.push(movie)
      return movie
    }
  
    updateMovie(id: string, updates: Partial<Movie>): Movie | null {
      const movie = this.movies.find(m => m.id === id)
      if (!movie) {
        return null
      }
      Object.assign(movie, updates)
      return movie
    }
  
    getMovie(id: string): Movie | null {
      return this.movies.find(m => m.id === id) || null
    }
  
    deleteMovie(id: string): boolean {
      const index = this.movies.findIndex(m => m.id === id)
      if (index === -1) {
        return false
      }
      this.movies.splice(index, 1)
      return true
    }
  
    addRating(id: string, rating: number): boolean {
      const movie = this.movies.find(m => m.id === id)
      if (!movie || rating < 1 || rating > 5) {
        return false
      }
      movie.ratings.push(rating)
      return true
    }
  
    getAverageRating(id: string): number | null {
      const movie = this.movies.find(m => m.id === id)
      if (!movie || movie.ratings.length === 0) {
        return null
      }
      return movie.ratings.reduce((a, b) => a + b, 0) / movie.ratings.length
    }
  
    getTopRatedMovies(): Movie[] {
      return this.movies.sort((a, b) => {
        const avgA = a.ratings.reduce((sum, r) => sum + r, 0) / a.ratings.length || 0
        const avgB = b.ratings.reduce((sum, r) => sum + r, 0) / b.ratings.length || 0
        return avgB - avgA
      })
    }
  
    getMoviesByGenre(genre: string): Movie[] {
      return this.movies.filter(m => m.genre === genre)
    }
  
    getMoviesByDirector(director: string): Movie[] {
      return this.movies.filter(m => m.director === director)
    }
  
    searchMovies(keyword: string): Movie[] {
      return this.movies.filter(m => m.title.includes(keyword))
    }
  }