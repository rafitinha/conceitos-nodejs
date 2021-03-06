const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());
//app.use(logRequests);
app.use('/repositories/:id', validateProjectId);

const repositories = [];

function logRequests(request, response, next){
  const { method, url } = request;

  const logLabel = `[${method}]${url}`; 
  
  console.log(logLabel);

  return next();
}

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid project ID.' });
  }

  return next();
}

app.get("/repositories", (request, response) => {
   return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const project = {id: uuid(), title, url, techs, likes: 0};

  repositories.push(project);

  return response.status(200).json(project);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const projectIndex = repositories.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found.' });
  }

  const likes = repositories[projectIndex].likes; 

  const project = { 
    id,
    title, 
    url,
    techs,
    likes
  };

  repositories[projectIndex] = project;

  return response.status(200).json(project);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found.' });
  }

  repositories.splice(projectIndex, 1)

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found.' });
  }

  const project = repositories[projectIndex];
  project.likes += 1;
  
  return response.status(200).json(project);

});

module.exports = app;
