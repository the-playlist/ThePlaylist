export function playlistAlgorithmV2(isFirstTimeFetched, flattenedPlaylist) {
  if (typeof isFirstTimeFetched == "string") {
    isFirstTimeFetched = JSON.parse(isFirstTimeFetched);
  }

  if (flattenedPlaylist?.length < 4) {
    return flattenedPlaylist;
  }

  //separate song adjust by master
  const flattenedRemainingPlaylist = flattenedPlaylist.filter(
    (song) => !song.isFixed && !song.sortByMaster && !song.requestToPerform
  );

  // Filter out songs that are not fixed (i.e., apply algorithm only to non-fixed songs)
  const nonFixedSongs = flattenedPlaylist.filter((song) => !song.isFixed);

  // Separate songs that are fixed
  const fixedSongs = flattenedPlaylist.filter((song) => song.isFixed);
  // Sort non-fixed songs by sortOrder initially
  nonFixedSongs.sort((a, b) => a.sortOrder - b.sortOrder);

  const modifiedRemainingSongs = applySongSequenceAlgorithmV2(
    flattenedRemainingPlaylist,
    fixedSongs
  );

  // Create a map to store sortByMaster songs with their original sortOrder
  const sortByMasterMap = new Map();
  const requestToPerformMap = new Map();

  flattenedPlaylist.forEach((song, index) => {
    if (index > 1 && song.sortByMaster) {
      sortByMasterMap.set(index, song);
    }
    if (index > 1 && song.requestToPerform) {
      requestToPerformMap.set(index, song);
    }
  });

  // Insert sortByMaster songs into a new final playlist based on their sortOrder
  const finalPlaylist = [];
  for (let i = 0; i < flattenedPlaylist?.length; i++) {
    if (sortByMasterMap.has(i)) {
      finalPlaylist.push(sortByMasterMap.get(i));
      sortByMasterMap.delete(i); // Remove inserted song from the map
    } else if (requestToPerformMap.has(i)) {
      finalPlaylist.push(requestToPerformMap.get(i));
      requestToPerformMap.delete(i); // Remove inserted song from the map
    } else {
      if (fixedSongs?.length == 0 && modifiedRemainingSongs?.length > 0) {
        finalPlaylist.push(modifiedRemainingSongs.shift());
      } else {
        finalPlaylist.push(
          fixedSongs.shift() || modifiedRemainingSongs.shift()
        );
      }
    }
  }

  return finalPlaylist;
}

export function applySongSequenceAlgorithmV2(songs, firstTwoSongs) {
  const secondSong = firstTwoSongs
    ? firstTwoSongs[firstTwoSongs?.length - 1]
    : null;

  const checkBackToBack = hasBackToBackViolations(songs, secondSong);

  let getRearrangeSongs;

  let tempRecentPlayer = firstTwoSongs
    ? firstTwoSongs[firstTwoSongs?.length - 1]?.playerName
    : null;

  getRearrangeSongs = reorderSongs(songs, tempRecentPlayer);

  return getRearrangeSongs;
}

export function playlistAlgorithm(isFirstTimeFetched, flattenedPlaylist) {
  if (typeof isFirstTimeFetched == "string") {
    isFirstTimeFetched = JSON.parse(isFirstTimeFetched);
  }

  const flattenedRemainingPlaylist = flattenedPlaylist.filter(
    (song) => !song.sortByMaster
  );

  // Separate first two songs
  const firstTwoSongs = flattenedPlaylist.slice(0, 2);

  const remainingSongs = flattenedPlaylist
    .slice(2)
    .filter((song) => !song.sortByMaster);

  // Ensure correct initial sort order for non-sortByMaster songs (assuming sortOrder is used for initial positioning)
  remainingSongs.sort((a, b) => a.sortOrder - b.sortOrder);

  // Apply algorithm to remaining songs (excluding first two and sortByMaster)
  const modifiedRemainingSongs = applySongSequenceAlgorithm(
    isFirstTimeFetched == true ? flattenedRemainingPlaylist : remainingSongs,
    isFirstTimeFetched == true ? null : firstTwoSongs
  );

  // Create a map to store sortByMaster songs with their original sortOrder
  const sortByMasterMap = new Map();

  flattenedPlaylist.forEach((song, index) => {
    if (index > 1 && song.sortByMaster) {
      sortByMasterMap.set(index, song);
    }
  });

  // Insert sortByMaster songs into a new final playlist based on their sortOrder
  const finalPlaylist = [];
  for (let i = 0; i < flattenedPlaylist?.length; i++) {
    if (sortByMasterMap.has(i)) {
      finalPlaylist.push(sortByMasterMap.get(i));
      sortByMasterMap.delete(i); // Remove inserted song from the map
    } else {
      if (isFirstTimeFetched == true && modifiedRemainingSongs?.length > 0) {
        finalPlaylist.push(modifiedRemainingSongs.shift());
      } else {
        finalPlaylist.push(
          firstTwoSongs.shift() || modifiedRemainingSongs.shift()
        );
      }
    }
  }
  return finalPlaylist;
}

export function applySongSequenceAlgorithm(songs, firstTwoSongs) {
  const modifiedSongs = [];
  const remainingSongs = [];
  const comedySongs = [];
  const customerAddedSongs = [];

  // Separate comedy songs, customer-added songs, and others
  for (const song of songs) {
    if (song.category === "Comedy") {
      comedySongs.push(song);
    } else if (song.addByCustomer) {
      customerAddedSongs.push(song);
    } else {
      remainingSongs.push(song);
    }
  }

  const lastPlayerFromFirstTwo = firstTwoSongs
    ? firstTwoSongs[1]?.playerName
    : null;
  const lastCategoryFromFirstTwo = firstTwoSongs
    ? firstTwoSongs[1]?.category
    : null;

  let lastCategory = lastCategoryFromFirstTwo;

  const recentPlayers = [];
  if (lastPlayerFromFirstTwo) {
    recentPlayers.push(lastPlayerFromFirstTwo);
  }

  let nonBalladCountSinceLastBallad = 0;

  while (remainingSongs?.length > 0) {
    let songAdded = false;

    for (let i = 0; i < remainingSongs?.length; i++) {
      const song = remainingSongs[i];

      // Ensure the player is not among the last three unique players
      const isPlayerAllowed = !recentPlayers.includes(song.playerName);

      // Ensure at least three non-ballad songs since the last ballad
      const isBalladAllowed =
        song.category !== "Ballad" || nonBalladCountSinceLastBallad >= 3;

      if (isPlayerAllowed && isBalladAllowed) {
        modifiedSongs.push(song);

        // Update recent players list
        recentPlayers.push(song.playerName);
        if (recentPlayers?.length > 3) {
          recentPlayers.shift(); // Remove the oldest entry to keep only the last three
        }

        // Update ballad tracking
        if (song.category === "Ballad") {
          nonBalladCountSinceLastBallad = 0;
        } else {
          nonBalladCountSinceLastBallad++;
        }

        lastCategory = song.category;
        remainingSongs.splice(i, 1); // Remove the song from the remaining list
        songAdded = true;
        break;
      }
    }

    if (!songAdded) {
      // Relax player rule and try to find any non-ballad song
      for (let i = 0; i < remainingSongs?.length; i++) {
        const song = remainingSongs[i];
        if (
          song.category !== "Ballad" &&
          !recentPlayers.includes(song.playerName)
        ) {
          modifiedSongs.push(song);

          // Update recent players list
          recentPlayers.push(song.playerName);
          if (recentPlayers?.length > 3) {
            recentPlayers.shift();
          }

          nonBalladCountSinceLastBallad++;
          lastCategory = song.category;
          remainingSongs.splice(i, 1); // Remove the song from the remaining list
          songAdded = true;
          break;
        }
      }
    }

    if (!songAdded) {
      // If still no song added, force add the next available song
      const song = remainingSongs.shift(); // Get the first remaining song
      modifiedSongs.push(song);

      // Update recent players list
      recentPlayers.push(song.playerName);
      if (recentPlayers?.length > 3) {
        recentPlayers.shift();
      }

      // Update ballad tracking
      if (song.category === "Ballad") {
        nonBalladCountSinceLastBallad = 0;
      } else {
        nonBalladCountSinceLastBallad++;
      }

      lastCategory = song.category;
    }
  }

  const finalPlaylist = [
    ...modifiedSongs,
    ...comedySongs,
    ...customerAddedSongs,
  ];
  // Sort remaining songs based on upVote - downVote (descending)
  finalPlaylist.sort((a, b) => b.upVote - b.downVote - (a.upVote - a.downVote));

  return finalPlaylist;
}

function hasBackToBackViolations(playlist, firstSong = null) {
  let previousSong = firstSong || playlist[0];

  const startIndex = firstSong ? 0 : 1;

  for (let i = startIndex; i < playlist.length; i++) {
    const currentSong = playlist[i];

    if (currentSong.playerName === previousSong.playerName) {
      return true;
    }

    if (
      previousSong.category === "Ballad" &&
      currentSong.category === "Ballad"
    ) {
      return true;
    }

    previousSong = currentSong;
  }

  return false;
}

function reorderSongs(songs, mostRecentPlayerName) {
  // Sort songs by voting difference in descending order
  const filterUpVotes = songs?.filter(
    (item) => item.upVote - item?.downVote > 0
  );
  const filterRemainigSongs = songs?.filter(
    (item) => item.upVote - item?.downVote <= 0
  );
  let sortUpVote = filterUpVotes.sort(
    (a, b) => b.upVote - b.downVote - (a.upVote - a.downVote)
  );
  let mergedSongs = [...sortUpVote, ...filterRemainigSongs];
  // let remainingSongs = [...sortUpVote, ...filterRemainigSongs];
  const remainingSongs = mergedSongs.map((song, index, array) => {
    if (song.applySwap) {
      const nextSong = array[index + 1];
      const secondNextSong = array[index + 2];

      // Check if second next song exists and playerName doesn't match
      if (secondNextSong && song.playerName !== secondNextSong.playerName) {
        // Perform the swap
        array[index + 1] = song;
        array[index] = nextSong;
        // Mark the swapped song to prevent further swaps
        song.applySwap = false;

        return nextSong; // The song being swapped out
      }
    }

    return song;
  });

  let orderedSongs = [];

  function placeSong() {
    for (let i = 0; i < remainingSongs.length; i++) {
      const currentSong = remainingSongs[i];
      const lastSong = orderedSongs[orderedSongs.length - 1];

      // Avoid Comedy as the first song
      if (orderedSongs.length === 0 && currentSong.category === "Comedy") {
        continue;
      }

      // Avoid placing a song from the same player as the most recent one at the start
      if (
        orderedSongs.length === 0 &&
        currentSong.playerName === mostRecentPlayerName
      ) {
        continue;
      }

      // Prioritize avoiding same-player consecutive songs
      if (
        (!lastSong || lastSong.playerName !== currentSong.playerName) &&
        (!lastSong ||
          lastSong.category !== "Ballad" ||
          currentSong.category !== "Ballad")
      ) {
        orderedSongs.push(currentSong);
        remainingSongs.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  // Main loop
  while (remainingSongs.length > 0) {
    if (!placeSong()) {
      // If unable to place due to constraints, append remaining songs to the bottom
      orderedSongs = orderedSongs.concat(remainingSongs);
      break;
    }
  }

  return orderedSongs;
}
