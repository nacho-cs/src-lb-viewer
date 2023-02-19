# Speedrun.com Leaderboard Viewer

This is a simple way to view [speedrun.com](https://speedrun.com) leaderboards.

There is:

- Autocompletion for entering the game, category, and subcategory name.
- Links to view the runs
- Pictures of the runner's country
- The runner's names are colored
- A very neatly organized leaderboard

The leaderboard looks something like this:

| Place | Player | Time     | Date       | Link      |
| ----- | ------ | -------- | ---------- | --------- |
| 33    | Anon   | 00:31:28 | 2022-06-09 | LINK HERE |
|       |        |          |            |           |

This was pretty obviously made with the [SRC API](https://github.com/speedruncomorg/api)

Interestly, there are two versions of the API.

The first version (the version the site uses) is extremely old. It hasn't been updated since 2017, but it is very simple to use. The only problem is that there are a lot of issues and there are a lot of edge cases you need to account for.

The second version of the API seems to be proprietary to [SRC](https://speedrun.com). The requests to the API are extremely complicated and barely anyone understands them. The responses however are much more easy to work with. Here for example is a simple request to retrieve the top 200 runs for Celeste Any%
```
https://www.speedrun.com/api/v2/GetGameLeaderboard?_r=eyJwYXJhbXMiOnsiZ2FtZUlkIjoibzF5OWo5djYiLCJjYXRlZ29yeUlkIjoiN2tqcGwxZ2siLCJ2YWx1ZXMiOltdLCJ0aW1lciI6MiwicmVnaW9uSWRzIjpbXSwicGxhdGZvcm1JZHMiOltdLCJ2aWRlbyI6MCwib2Jzb2xldGUiOjB9LCJwYWdlIjoxLCJ2YXJ5IjoxNjc2ODA1MDMxfQ
```

I made this website to view the websites of a game effeciently. [SRC](https://speedrun.com) has been on the decline recently so I decided to make a little website to view the leaderboard for a game since I figure that a lot of people just use speedrun.com for that purpose anyway.
