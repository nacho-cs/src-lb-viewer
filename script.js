const url = "https://www.speedrun.com/api/v1";

const getLinks = async () => {
  // fetch the main categories and all the levels of a game
  // --------------- I LEFT THE CODE FOR GETTING THE LEVELS OF A GAME IF ANYONE WANTS TO MESS AROUND WITH IT. --------------------
  const options = document.querySelectorAll("option");
  if (options.length > 0) {
    options.forEach((option) => {
      option.remove();
    });
  }
  let abbrv = document.getElementById("input-box").value;
  const res = await fetch(`${url}/games/${abbrv}/categories`);
  let data = await res.json();
  // const res2 = await fetch(`${url}/games/${abbrv}/levels`);
  // let data2 = await res2.json();
  data = data.data;
  // data2 = data2.data;
  let varLinks = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].type != "per-level") {
      let info = {};
      info.link = data[i].links[2].uri;
      info.name = data[i].name;
      info.id = data[i].id;
      varLinks.push(info);
    }
  }
  // for (let i = 0; i < data2.length; i++) {
  //   let info = {};
  //   info.link = data2[i].links[3].uri;
  //   info.name = data2[i].name;
  //   info.id = data2[i].id;
  //   varLinks.push(info);
  // }
  varLinks.forEach((category) => {
    let option = document.createElement("option");
    option.value = category.id;
    option.innerText = category.name;
    document.getElementById("cat-options").appendChild(option);
  });
};

const getSubCategories = async () => {
  // this here gets the subcategories of a game
  const id = document.getElementById("cat-input-box").value;
  const res = await fetch(
    `https://www.speedrun.com/api/v1/categories/${id}/variables`
  );
  let variables = await res.json();
  let vars = [];
  variables = variables.data;
  for (let i = 0; i < variables.length; i++) {
    if (variables[i]["is-subcategory"]) {
      const keys = Object.keys(variables[i].values.choices);
      for (let j = 0; j < keys.length; j++) {
        let varInfo = {};
        varInfo.id = `var-${variables[i].id}=${keys[j]}`;
        varInfo.name = `${variables[i].values.choices[keys[j]]}`;
        vars.push(varInfo);
      }
    }
  }
  vars.forEach((variable) => {
    const option = document.createElement("option");
    option.value = variable.id;
    option.innerText = variable.name;
    document.getElementById("subcat-options").appendChild(option);
  });
};

// these next two blocks of code are responsible for the autocompletion of the game search bar
async function getGames(abbrv) {
  const res = await fetch(
    `https://www.speedrun.com/api/v1/games?name=${abbrv}&_bulk=true&max=10`
  );
  let games = await res.json();
  games = games.data;
  // clears out old options
  const options = document.querySelectorAll("option");
  if (options.length > 0) {
    options.forEach((option) => {
      option.remove();
    });
  }
  for (let i = 0; i < games.length; i++) {
    delete games[i].id;
    games[i].name = games[i].names.international;
    delete games[i].names;
    const option = document.createElement("option");
    option.value = games[i].abbreviation;
    option.innerText = games[i].name;
    document.getElementById("game-options").appendChild(option);
  }
}

let count = 0;
const inputBox = document.getElementById("input-box");
inputBox.addEventListener("input", async () => {
  count++;
  if (
    (count % 3 == 0 && inputBox.value.length > 0) ||
    (count < 2 && inputBox.value.length > 0)
  ) {
    getGames(inputBox.value);
  }
});

// this here gets the leaderboard of a game
// i was originally going to have leaderboard pagination but it didn't work
const getLeaderboard = async () => {
  const variables = document.getElementById("subcat-input-box").value;
  const category = document.getElementById("cat-input-box").value;
  const game = document.getElementById("input-box").value;
  // let offset = info.length / 4;
  let info = [];
  document.getElementById("loading").style.visibility = "visible";
  const res = await fetch(
    `${url}/leaderboards/${game}/category/${category}?embed=players&${variables}&video-only=true`
  );
  let leaderboard = await res.json();
  let players = leaderboard.data.players.data;
  leaderboard = leaderboard.data.runs;
  for (let i = 0; i < leaderboard.length; i++) {
    info.push(leaderboard[i].place);
    // properly formats the runners name + adds the runners location + adds the color of the runners name (very flipping complicated)
    // i probably should have used a table instead of a css grid
    // oh well
    if (typeof players[i]?.names?.international !== "undefined") {
      info.push(
        players[i].location && players[i]["name-style"]["color-to"]
          ? `<img src="https://www.speedrun.com/images/flags/${players[i].location.country.code}.png" /> <span style="color: ${players[i]["name-style"]["color-to"].light}; "> ${players[i].names.international} </span>`
          : players[i].names.international
      );
    } else if (typeof players[i]?.names?.japanese !== "undefined") {
      info.push(
        players[i].location && players[i]["name-style"]["color-to"]
          ? `<img src="https://www.speedrun.com/images/flags/${players[i].location.country.code}.png" /> <span style="color: ${players[i]["name-style"]["color-to"].light}; "> ${players[i].names.japanese}) </span>`
          : players[i].names.japanese
      );
    } else if (players[i].name.includes("jp")) {
      info.push(
        players[i].location && players[i]["name-style"]["color-to"]
          ? `<img src="https://www.speedrun.com/images/flags/${
              players[i].location.country.code
            }.png" <span style="color: ${
              players[i]["name-style"]["color-to"].light
            }; "> ${players[i].name.substring(
              4,
              players[i].name.length
            )} </span>`
          : players[i].name.substring(4, players[i].name.length)
      );
    } else {
      info.push(
        players[i].location && players[i]["name-style"]["color-to"]
          ? `<img src="https://www.speedrun.com/images/flags/${players[i].location.country.code}.png" <span style="color: ${players[i]["name-style"]["color-to"].light}; "> ${players[i].name} </span>`
          : players[i].name
      );
    }
    info.push(convert(leaderboard[i].run.times["primary_t"]));
    info.push(leaderboard[i].run.date);
    info.push(
      leaderboard[i].run.videos.links
        ? leaderboard[i].run.videos.links[0].uri
        : leaderboard[i].run.weblink
    );
  }
  // adds everything to the website
  let count = 0;
  info.forEach((information) => {
    count++;
    if (count % 5 == 0) {
      const a = document.createElement("a");
      a.href = information;
      a.classList.add("run");
      a.innerHTML = `<span class="material-symbols-outlined">open_in_new</span>`;
      document.getElementById("lb-wrapper").appendChild(a);
    } else if (count % 5 == 2) {
      const p = document.createElement("span");
      p.innerHTML = `${information}`;
      p.classList.add("run");
      document.getElementById("lb-wrapper").appendChild(p);
    } else {
      const p = document.createElement("span");
      p.innerText = information;
      p.classList.add("run");
      document.getElementById("lb-wrapper").appendChild(p);
    }
  });
  // showMoreButton();
  document.getElementById("loading").style.visibility = "hidden";
  document.getElementById("loading").style.height = "0px";
};

// https://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript (lol)
// converts from seconds to hh:mm:ss.ms
function convert(seconds) {
  return new Date(seconds * 1000).toISOString().slice(11, 23);
}

// function showMoreButton() {
//   const div = document.createElement("div");
//   div.innerText = "Load More...";
//   div.classList.add("btn");
//   div.id = "show-more";
//   div.classList.add("run");
//   div.onclick = () => getLeaderboard();
//   document.getElementById("lb-wrapper").appendChild(div);
// }

function clearLeaderboard() {
  // clears out the leaderboard
  const runs = document.querySelectorAll(".run");
  if (typeof runs.length !== "undefined") {
    runs.forEach((run) => {
      run.remove();
    });
  }
}
