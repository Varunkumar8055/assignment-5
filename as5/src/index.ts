import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { MovieService } from "./MovieService";

const app = new Hono();
const movieService = new MovieService();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/movies", async (c) => {
  const movie = await c.req.json();
  const addedMovie = movieService.addMovie(movie);
  if (!addedMovie) {
    return c.json({ error: "Invalid data" }, 400);
  }
  return c.json(addedMovie, 201);
});

app.patch("/movies/:id", async (c) => {
  const id = c.req.param("id");
  const updates = await c.req.json();
  const updatedMovie = movieService.updateMovie(id, updates);
  if (!updatedMovie) {
    return c.json({ error: "Movie not found or invalid data" }, 404);
  }
  return c.json(updatedMovie);
});

app.get("/movies/:id", (c) => {
  const id = c.req.param("id");
  const movie = movieService.getMovie(id);
  if (!movie) {
    return c.json({ error: "Movie not found" }, 404);
  }
  return c.json(movie);
});

app.delete("/movies/:id", (c) => {
  const id = c.req.param("id");
  const deleted = movieService.deleteMovie(id);
  if (!deleted) {
    return c.json({ error: "Movie not found" }, 404);
  }
  return c.json({ message: "Movie deleted" });
});

app.post("/movies/:id/rating", async (c) => {
  const id = c.req.param("id");
  const { rating } = await c.req.json();
  const added = movieService.addRating(id, rating);
  if (!added) {
    return c.json({ error: "Invalid rating or movie not found" }, 400);
  }
  return c.json({ message: "Rating added" });
});

app.get("/movies/:id/rating", (c) => {
  const id = c.req.param("id");
  const averageRating = movieService.getAverageRating(id);
  if (averageRating === null) {
    return c.json({ error: "Movie not found or no ratings" }, 404);
  }
  return c.json({ averageRating });
});

app.get("/movies/top-rated", (c) => {
  const topRatedMovies = movieService.getTopRatedMovies();
  return c.json(topRatedMovies);
});

app.get("/movies/genre/:genre", (c) => {
  const genre = c.req.param("genre");
  const genreMovies = movieService.getMoviesByGenre(genre);
  if (genreMovies.length === 0) {
    return c.json({ error: "No movies found for this genre" }, 404);
  }
  return c.json(genreMovies);
});

app.get("/movies/director/:director", (c) => {
  const director = c.req.param("director");
  const directorMovies = movieService.getMoviesByDirector(director);
  if (directorMovies.length === 0) {
    return c.json({ error: "No movies found for this director" }, 404);
  }
  return c.json(directorMovies);
});

app.get("/movies/search", (c) => {
  const keyword = c.req.query("keyword");
  const searchResults = movieService.searchMovies(keyword);
  if (searchResults.length === 0) {
    return c.json({ error: "No movies found" }, 404);
  }
  return c.json(searchResults);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
