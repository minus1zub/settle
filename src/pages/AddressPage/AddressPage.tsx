import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AddressStep } from '../../features/address/AddressStep';
import { useOrderStore } from '../../stores/orderStore';

export const AddressPage = () => {
  const navigate = useNavigate();
  const address = useOrderStore((state) => state.address);
  const setAddress = useOrderStore((state) => state.setAddress);
  const hasMilestone = useOrderStore((state) => state.hasMilestone);
  const markMilestone = useOrderStore((state) => state.markMilestone);

  return (
    <div className="page">
      <section className="page-heading">
        <span className="eyebrow">Адрес заказа</span>
        <h1>Прикрепить адрес</h1>
        <p>Это не доставка, а маленький штрих, чтобы заказ выглядел почти настоящим.</p>
      </section>

      <AddressStep
        value={address}
        onConfirm={(nextAddress) => {
          setAddress(nextAddress);
          if (!hasMilestone('address-selected')) {
            markMilestone('address-selected');
            toast.success('Адрес закреплен', {
              description: 'Теперь заказ выглядит почти настоящим.',
            });
          } else {
            toast.success('Адрес обновлен');
          }
          navigate('/order');
        }}
      />
    </div>
  );
};
