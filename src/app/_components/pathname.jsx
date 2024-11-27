import {
  DutyIcon,
  PlaylistIcon,
  PlayerIcon,
  SongIcon,
  SettingIcon,
  LiveRequestIcon,
} from "../svgs";
import LocationIcon from "../svgs/location";

export const navlinks = [
  {
    name: "Playlist",
    href: "/playlist",
    icon: (isActive, masterViewTheme) => (
      <PlaylistIcon
        color={isActive ? "#EFC440" : !masterViewTheme ? "#fff" : "#000"}
      />
    ),
  },
  {
    name: "Duty",
    href: "/duty",
    icon: (isActive, masterViewTheme) => (
      <DutyIcon
        color={isActive ? "#EFC440" : !masterViewTheme ? "#fff" : "#000"}
      />
    ),
  },
  {
    name: "Players",
    href: "/players",
    icon: (isActive, masterViewTheme) => (
      <PlayerIcon
        color={isActive ? "#EFC440" : !masterViewTheme ? "#fff" : "#000"}
      />
    ),
  },
  {
    name: "Songs",
    href: "/songs",
    icon: (isActive, masterViewTheme) => (
      <SongIcon
        color={isActive ? "#EFC440" : !masterViewTheme ? "#fff" : "#000"}
      />
    ),
  },

  {
    name: "Settings",
    href: "/settings",
    icon: (isActive, masterViewTheme) => (
      <SettingIcon
        color={isActive ? "#EFC440" : !masterViewTheme ? "#fff" : "#000"}
      />
    ),
  },
  {
    name: "Live Requests",
    href: "/live-video-requests",
    icon: (isActive, masterViewTheme) => (
      <LiveRequestIcon
        color={isActive ? "#EFC440" : !masterViewTheme ? "#fff" : "#000"}
      />
    ),
  },
  {
    name: "Location",
    href: "/location",
    icon: (isActive, masterViewTheme) => (
      <LocationIcon
        color={isActive ? "#EFC440" : !masterViewTheme ? "#fff" : "#000"}
      />
    ),
  },
];
