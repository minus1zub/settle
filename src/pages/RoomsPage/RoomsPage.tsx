import { RoomCard } from '../../components/RoomCard/RoomCard';
import { rooms } from '../../data/rooms';

export const RoomsPage = () => (
  <div className="page">
    <section className="page-heading">
      <span className="eyebrow">Старт заказа</span>
      <h1>Комнаты</h1>
      <p>Выберите комнату, с которой хочется начать заказ.</p>
    </section>

    <div className="room-list">
      {rooms.map((room) => (
        <RoomCard room={room} size="large" key={room.id} />
      ))}
    </div>
  </div>
);
