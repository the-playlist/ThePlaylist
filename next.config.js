/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MONGODB_URI:
      "mongodb+srv://developerdevexcel:WalmbyGlsGokDVi0@playlistcluster.nx3cdw7.mongodb.net/thePlaylist_db",
    LOCAL_URL: "http://localhost:3000/",
    DEPLOYMENT_URL: "https://the-playlist-rosy.vercel.app/",
  },
};
module.exports = nextConfig;
