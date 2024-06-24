export function playlistAlgorithm(isFirstTimeFetched, flattenedPlaylist) {
  if (typeof isFirstTimeFetched == "string") {
    isFirstTimeFetched = JSON.parse(isFirstTimeFetched);
  }
  console.log("isFirstTimeFetched", isFirstTimeFetched);

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

  // Sort remaining songs based on upVote - downVote (descending)
  modifiedRemainingSongs.sort(
    (a, b) => b.upVote - b.downVote - (a.upVote - a.downVote)
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
  for (let i = 0; i < flattenedPlaylist.length; i++) {
    if (sortByMasterMap.has(i)) {
      finalPlaylist.push(sortByMasterMap.get(i));
      sortByMasterMap.delete(i); // Remove inserted song from the map
    } else {
      if (isFirstTimeFetched == true) {
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

// export function applySongSequenceAlgorithm(songs, firstTwoSongs) {
//   const modifiedSongs = [];
//   const remainingSongs = [];
//   const comedySongs = [];
//   const customerAddedSongs = [];

//   // Separate comedy songs, customer-added songs, and others
//   for (const song of songs) {
//     if (song.category === "Comedy") {
//       comedySongs.push(song);
//     } else if (song.addByCustomer) {
//       customerAddedSongs.push(song);
//     } else {
//       remainingSongs.push(song);
//     }
//   }

//   const lastPlayerFromFirstTwo =
//     firstTwoSongs != null ? firstTwoSongs[1]?.playerName : null;
//   const lastCategoryFromFirstTwo =
//     firstTwoSongs != null ? firstTwoSongs[1]?.category : null;

//   let lastPlayerName = lastPlayerFromFirstTwo;
//   let lastCategory = lastCategoryFromFirstTwo;

//   while (remainingSongs.length > 0) {
//     let songAdded = false;

//     for (let i = 0; i < remainingSongs.length; i++) {
//       const song = remainingSongs[i];

//       if (
//         (lastPlayerName === null || song.playerName !== lastPlayerName) &&
//         (lastCategory === null ||
//           lastCategory !== "Ballad" ||
//           song.category !== "Ballad")
//       ) {
//         modifiedSongs.push(song);
//         lastPlayerName = song.playerName;
//         lastCategory = song.category;
//         remainingSongs.splice(i, 1); // Remove the song from the remaining list
//         songAdded = true;
//         break;
//       }
//     }

//     if (!songAdded) {
//       // If no song was added in this iteration, it means we cannot find a suitable song
//       // and need to force add a song to avoid an infinite loop
//       const song = remainingSongs.shift(); // Get the first remaining song
//       modifiedSongs.push(song);
//       lastPlayerName = song.playerName;
//       lastCategory = song.category;
//     }
//   }

//   // Concatenate comedy songs and customer-added songs to the end of the result
//   return [...modifiedSongs, ...customerAddedSongs, ...comedySongs];
// }

// export function applySongSequenceAlgorithm(songs, firstTwoSongs) {
//   const modifiedSongs = [];
//   const remainingSongs = [];
//   const comedySongs = [];
//   const customerAddedSongs = [];

//   // Separate comedy songs, customer-added songs, and others
//   for (const song of songs) {
//     if (song.category === "Comedy") {
//       comedySongs.push(song);
//     } else if (song.addByCustomer) {
//       customerAddedSongs.push(song);
//     } else {
//       remainingSongs.push(song);
//     }
//   }

//   const lastPlayerFromFirstTwo =
//     firstTwoSongs != null ? firstTwoSongs[1]?.playerName : null;
//   const lastCategoryFromFirstTwo =
//     firstTwoSongs != null ? firstTwoSongs[1]?.category : null;

//   let lastPlayerName = lastPlayerFromFirstTwo;
//   let lastCategory = lastCategoryFromFirstTwo;

//   while (remainingSongs.length > 0) {
//     let songAdded = false;

//     for (let i = 0; i < remainingSongs.length; i++) {
//       const song = remainingSongs[i];

//       // Primary rule: Avoid consecutive songs by the same player
//       const isDifferentPlayer =
//         lastPlayerName === null || song.playerName !== lastPlayerName;

//       // Secondary rule: Avoid consecutive ballad songs where possible
//       const canPlaceBallad =
//         lastCategory === null ||
//         lastCategory !== "Ballad" ||
//         song.category !== "Ballad";

//       if (isDifferentPlayer && canPlaceBallad) {
//         modifiedSongs.push(song);
//         lastPlayerName = song.playerName;
//         lastCategory = song.category;
//         remainingSongs.splice(i, 1); // Remove the song from the remaining list
//         songAdded = true;
//         break;
//       }
//     }

//     if (!songAdded) {
//       // If no song was added in this iteration, it means we cannot find a suitable song
//       // Relax ballad rule, but still try to follow player rule
//       for (let i = 0; i < remainingSongs.length; i++) {
//         const song = remainingSongs[i];
//         if (lastPlayerName === null || song.playerName !== lastPlayerName) {
//           modifiedSongs.push(song);
//           lastPlayerName = song.playerName;
//           lastCategory = song.category;
//           remainingSongs.splice(i, 1); // Remove the song from the remaining list
//           songAdded = true;
//           break;
//         }
//       }
//     }

//     if (!songAdded) {
//       // If still no song was added, force add any song to avoid an infinite loop
//       const song = remainingSongs.shift(); // Get the first remaining song
//       modifiedSongs.push(song);
//       lastPlayerName = song.playerName;
//       lastCategory = song.category;
//     }
//   }

//   // Concatenate comedy songs and customer-added songs to the end of the result
//   return [...modifiedSongs, ...customerAddedSongs, ...comedySongs];
// }

// export function applySongSequenceAlgorithm(songs, firstTwoSongs) {
//   const modifiedSongs = [];
//   const remainingSongs = [];
//   const comedySongs = [];
//   const customerAddedSongs = [];

//   // Separate comedy songs, customer-added songs, and others
//   for (const song of songs) {
//     if (song.category === "Comedy") {
//       comedySongs.push(song);
//     } else if (song.addByCustomer) {
//       customerAddedSongs.push(song);
//     } else {
//       remainingSongs.push(song);
//     }
//   }

//   const lastPlayerFromFirstTwo = firstTwoSongs
//     ? firstTwoSongs[1]?.playerName
//     : null;
//   const lastCategoryFromFirstTwo = firstTwoSongs
//     ? firstTwoSongs[1]?.category
//     : null;

//   let lastCategory = lastCategoryFromFirstTwo;

//   const recentPlayers = [];
//   if (lastPlayerFromFirstTwo) {
//     recentPlayers.push(lastPlayerFromFirstTwo);
//   }

//   while (remainingSongs.length > 0) {
//     let songAdded = false;

//     for (let i = 0; i < remainingSongs.length; i++) {
//       const song = remainingSongs[i];

//       // Ensure the player is not among the last three unique players
//       const isPlayerAllowed = !recentPlayers.includes(song.playerName);

//       // Ensure no consecutive ballad songs
//       const canPlaceBallad =
//         lastCategory === null ||
//         lastCategory !== "Ballad" ||
//         song.category !== "Ballad";

//       if (isPlayerAllowed && canPlaceBallad) {
//         modifiedSongs.push(song);

//         // Update recent players list
//         recentPlayers.push(song.playerName);
//         if (recentPlayers.length > 3) {
//           recentPlayers.shift(); // Remove the oldest entry to keep only the last three
//         }

//         lastCategory = song.category;
//         remainingSongs.splice(i, 1); // Remove the song from the remaining list
//         songAdded = true;
//         break;
//       }
//     }

//     if (!songAdded) {
//       // Relax ballad rule if no suitable song found
//       for (let i = 0; i < remainingSongs.length; i++) {
//         const song = remainingSongs[i];
//         if (!recentPlayers.includes(song.playerName)) {
//           modifiedSongs.push(song);

//           // Update recent players list
//           recentPlayers.push(song.playerName);
//           if (recentPlayers.length > 3) {
//             recentPlayers.shift();
//           }

//           lastCategory = song.category;
//           remainingSongs.splice(i, 1); // Remove the song from the remaining list
//           songAdded = true;
//           break;
//         }
//       }
//     }

//     if (!songAdded) {
//       // Force add a song if no other option is available
//       const song = remainingSongs.shift(); // Get the first remaining song
//       modifiedSongs.push(song);

//       // Update recent players list
//       recentPlayers.push(song.playerName);
//       if (recentPlayers.length > 3) {
//         recentPlayers.shift();
//       }

//       lastCategory = song.category;
//     }
//   }

//   // Concatenate comedy songs and customer-added songs to the end of the result
//   return [...modifiedSongs, ...customerAddedSongs, ...comedySongs];
// }

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

  while (remainingSongs.length > 0) {
    let songAdded = false;

    for (let i = 0; i < remainingSongs.length; i++) {
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
        if (recentPlayers.length > 3) {
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
      for (let i = 0; i < remainingSongs.length; i++) {
        const song = remainingSongs[i];
        if (
          song.category !== "Ballad" &&
          !recentPlayers.includes(song.playerName)
        ) {
          modifiedSongs.push(song);

          // Update recent players list
          recentPlayers.push(song.playerName);
          if (recentPlayers.length > 3) {
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
      if (recentPlayers.length > 3) {
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

  // Concatenate comedy songs and customer-added songs to the end of the result
  return [...modifiedSongs, ...customerAddedSongs, ...comedySongs];
}
