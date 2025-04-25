const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const app = express();

const port = 5002;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Welcome to the Pokémon Info Server");
});

app.get("/acceuil", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/formulaire", (req, res) => {
  res.sendFile(path.join(__dirname, "formulaire.html"));
});

app.post("/formulaire", async (req, res) => {
  console.log("Formulaire soumis !");
  const name = req.body.name.toLowerCase();
  const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
  try {
    const response = await axios.get(url);
    const donnees = response.data;
    console.log(donnees);

    res.send(
      `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="/style.css" />
  <title>Infos Pokémon</title>
</head>
<body>
  <h1>Informations de ${donnees.name}</h1>
  <h2>ID : ${donnees.id}</h2>
  <h2>Taille : ${donnees.height}</h2>
  <h2>Poids : ${donnees.weight}</h2>
  <img src="${donnees.sprites.front_default}" alt="${donnees.name}" />
  
  <h3>Stats</h3>
  <ul>
    ${donnees.stats
      .map((stat) => `<li>${stat.stat.name} : ${stat.base_stat}</li>`)
      .join("")}
  </ul>

  <h3>Types</h3>
  <ul>
    ${donnees.types.map((type) => `<li>${type.type.name}</li>`).join("")}
  </ul>

  <h3>Abilities</h3>
  <ul>
    ${donnees.abilities
      .map((ability) => `<li>${ability.ability.name}</li>`)
      .join("")}
  </ul>

  <h3>Moves</h3>
  <ul>
    ${donnees.moves
      .slice(0, 15)
      .map((move) => `<li>${move.move.name}</li>`)
      .join("")}
  </ul>
</body>
</html>
`
    );
  } catch (error) {
    // Si l'API retourne une erreur 404 ou autre
    if (error.response && error.response.status === 404) {
      res
        .status(404)
        .send(
          `<h2>Pokémon non trouvé. Veuillez réessayer avec un autre nom.</h2>`
        );
    } else {
      res.status(500).send("Erreur lors de la récupération des données.");
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
