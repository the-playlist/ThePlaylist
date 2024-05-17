import {
  DutyIcon,
  PlaylistIcon,
  PlayerIcon,
  SongIcon,
  SettingIcon,
  LiveRequestIcon,
} from "../svgs";

export const navlinks = [
  {
    name: "Playlist",
    href: "/playlist",
    icon: (isActive) => <PlaylistIcon color={isActive ? "#EFC440" : "#000"} />,
  },
  {
    name: "Duty",
    href: "/duty",
    icon: (isActive) => <DutyIcon color={isActive ? "#EFC440" : "#000"} />,
  },
  {
    name: "Players",
    href: "/players",
    icon: (isActive) => <PlayerIcon color={isActive ? "#EFC440" : "#000"} />,
  },
  {
    name: "Songs",
    href: "/songs",
    icon: (isActive) => <SongIcon color={isActive ? "#EFC440" : "#000"} />,
  },

  {
    name: "Settings",
    href: "/settings",
    icon: (isActive) => <SettingIcon color={isActive ? "#EFC440" : "#000"} />,
  },
  {
    name: "Live Video Requests",
    href: "/live-video-requests",
    icon: (isActive) => (
      <LiveRequestIcon color={isActive ? "#EFC440" : "#000"} />
    ),
  },
];
