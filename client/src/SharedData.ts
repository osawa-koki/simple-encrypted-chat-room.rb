import Room from "./Room";

type SharedData = {
  username: string;
  current_room: Room | null;
  rooms: Room[];
  key: string;
  message: string;
};

export default SharedData;
