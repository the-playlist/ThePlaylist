import Players from "../models/players";
import ResponseModel from "./responseModel";
import Playlist from "../models/playlist";
import PlaylistV2 from "../models/playlistV2";

export const getAllStaff = async(req, res, next) => {
    const players = await Players.find().select("firstName lastName duty");
    const response = new ResponseModel(
        true,
        "Staff fetched successfully",
        players
    );
    res.status(200).json(response);
};

// export const updateDutyStatus = async(req, res, next) => {
//     try {
//         const updates = req.body;
//         const responseMessages = [];
//         for (const { id, status, startTime }
//             of updates) {
//             const filter = { _id: id };
//             const update = {
//                 $set: { "duty.status": status, "duty.startTime": startTime },
//             };
//             const updatedPlayer = await Players.findOneAndUpdate(filter, update, {
//                 new: true,
//             });

//             if (updatedPlayer) {
//                 responseMessages.push(
//                     `Status updated successfully for player with ID ${id}`
//                 );
//                 if (status === false) {
//                     const updatedPlaylists = await Playlist.updateMany({
//                         assignedPlayer: id,
//                         isDeleted: false,
//                     }, { $set: { isDeleted: true } });

//                     await PlaylistV2.updateMany({
//                         assignedPlayer: id,
//                         isDeleted: false,
//                     }, { $set: { isDeleted: true } });
//                 }
//             } else {
//                 responseMessages.push(
//                     `Player with ID ${id} not found or already has status=true`
//                 );
//             }
//         }

//         res.status(200).json({ success: true, messages: responseMessages });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

export const updateDutyStatus = async(req, res, next) => {
    try {
        const updates = req.body;
        const responseMessages = [];

        // Prepare bulk update operations for players
        const playerUpdateOps = updates.map(({ id, status, startTime }) => ({
            updateOne: {
                filter: { _id: id },
                update: {
                    $set: { "duty.status": status, "duty.startTime": startTime },
                },
            },
        }));

        // Execute bulk update for players
        const playerUpdateResults = await Players.bulkWrite(playerUpdateOps);

        // Collect IDs of players whose status was updated to false
        const playersWithFalseStatus = updates
            .filter(({ status }) => status === false)
            .map(({ id }) => id);

        // If there are players with status=false, update their playlists in both collections
        if (playersWithFalseStatus.length > 0) {
            const playlistUpdatePromises = [
                Playlist.updateMany({
                    assignedPlayer: { $in: playersWithFalseStatus },
                    isDeleted: false,
                }, { $set: { isDeleted: true } }),
                PlaylistV2.updateMany({
                    assignedPlayer: { $in: playersWithFalseStatus },
                    isDeleted: false,
                }, { $set: { isDeleted: true } }),
            ];

            const [playlistUpdateResults, playlistV2UpdateResults] =
            await Promise.all(playlistUpdatePromises);

            responseMessages.push(
                `${playlistUpdateResults.modifiedCount} playlists updated in Playlist collection and ${playlistV2UpdateResults.modifiedCount} playlists updated in PlaylistV2 collection`
            );
        }

        // Add response messages for player updates
        responseMessages.push(
            `Updated ${playerUpdateResults.modifiedCount} player(s) successfully`
        );

        res.status(200).json({ success: true, messages: responseMessages });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};