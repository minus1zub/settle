import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Room } from '../../types/product';

type RoomCardProps = {
  room: Room;
  size?: 'compact' | 'large';
};

export const RoomCard = ({ room, size = 'compact' }: RoomCardProps) => (
  <Link to={`/rooms/${room.id}`} className={`room-card room-card--${size}`}>
    <img className="room-card__image" src={room.image} alt="" loading="lazy" decoding="async" />
    <span className="room-card__glow" aria-hidden="true" />
    <span className="room-card__badge" aria-hidden="true">
      <ArrowUpRight size={16} />
    </span>
    <span className="room-card__content">
      <span className="room-card__title">{room.title}</span>
      <span className="room-card__description">{room.description}</span>
    </span>
  </Link>
);
