const fs = require('fs');
const axios = require('axios');
const prompt = require('prompt');

const apiUrl = 'https://icanhazdadjoke.com/search';

async function fetchAndSaveJoke(searchTerm) {
  try {
    const response = await axios.get(apiUrl, {
      headers: { 'Accept': 'application/json' },
      params: { term: searchTerm },
    });

    const jokes = response.data.results;

    if (jokes.length === 0) {
      console.log('No jokes found for the search term:', searchTerm);
    } else {
      const randomJoke = jokes[Math.floor(Math.random() * jokes.length)].joke;
      console.log('Random Joke:');
      console.log(randomJoke);
      fs.appendFileSync('jokes.txt', randomJoke + '\n');
      console.log('Joke saved to jokes.txt');
    }
  } catch (error) {
    console.error('Error fetching jokes:', error);
  }
}

function displayLeaderboard() {
  const jokes = fs.readFileSync('jokes.txt', 'utf8').split('\n').filter(Boolean);
  const jokeCounts = {};

  jokes.forEach((joke) => {
    jokeCounts[joke] = (jokeCounts[joke] || 0) + 1;
  });

  const sortedJokes = Object.keys(jokeCounts).sort((a, b) => jokeCounts[b] - jokeCounts[a]);

  if (sortedJokes.length > 0) {
    console.log('Most popular joke:');
    console.log(sortedJokes[0]);
  } else {
    console.log('No jokes found in jokes.txt');
  }
}


function main() {
  const args = process.argv.slice(2);

  if (args.includes('leaderboard')) {
    displayLeaderboard();
  } else {
    if (args.length === 0) {
      prompt.start();
      prompt.get(['searchTerm'], (err, result) => {
        if (err) {
          console.error('Error getting input:', err);
          return;
        }
        fetchAndSaveJoke(result.searchTerm);
      });
    } else {
      fetchAndSaveJoke(args[0]);
    }
  }
}

main();