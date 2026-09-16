import { useParams } from "react-router-dom";
import { RoomDetailPageContent } from "../modules/room-detail/RoomDetailPageContent";

export function RoomDetailPage() {
  const { roomId } = useParams();

  return <RoomDetailPageContent key={roomId} />;
}
