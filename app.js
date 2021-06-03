const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "moviesData.db");
let db = null;

initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server has started");
    });
  } catch (error) {
    console.log(`DB Error: &{error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const getMovieDetailsInResponseFormate = (dbObject) => {
  const { movie_id, director_id, movie_name, lead_actor } = dbObject;
  return {
    movieId: movie_id,
    directorId: director_id,
    movieName: movie_name,
    leadActor: lead_actor,
  };
};
const getDirectorDetailsInResponseFormate = (dbObject) => {
  const { director_id, director_name } = dbObject;
  return {
    directorId: director_id,
    directorName: director_name,
  };
};

app.get("/movies/", async (request, response) => {
  const getMovieNamesQuery = `SELECT movie_name FROM movie`;
  const dbData = await db.all(getMovieNamesQuery);
  response.send(
    dbData.map((eachMovie) => getMovieDetailsInResponseFormate(eachMovie))
  );
});

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const addMovieQuery = `
  INSERT INTO 
  movie 
  (director_id,movie_name,lead_actor)
  VALUES
  (${directorId},'${movieName}','${leadActor}')
  `;

  const dbResponse = await db.run(addMovieQuery);
  const movieId = dbResponse.lastId;
  response.send("Movie Successfully Added");
});
