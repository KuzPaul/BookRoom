import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "../shared/layout/AppLayout";
import { RoomsPage } from "../pages/RoomsPage";
import { RoomDetailPage } from "../pages/RoomDetailPage";
import { BookingsPage } from "../pages/BookingsPage";
import { NotFoundPage } from "../pages/NotFoundPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/rooms" replace />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="rooms/:roomId" element={<RoomDetailPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
