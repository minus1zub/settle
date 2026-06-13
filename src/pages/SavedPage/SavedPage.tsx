import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { favoriteService } from '../../services/favoriteService';
import { useFavoriteStore } from '../../stores/favoriteStore';

export const SavedPage = () => {
  const ids = useFavoriteStore((state) => state.ids);
  const savedProducts = favoriteService.getProductsByIds(ids);

  if (savedProducts.length === 0) {
    return (
      <div className="page">
        <EmptyState
          title="Сохраненное"
          text="Здесь будут товары, к которым хочется вернуться."
          action={
            <Link to="/rooms" className="primary-button">
              Посмотреть комнаты
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="page">
      <section className="page-heading">
        <span className="eyebrow">На потом</span>
        <h1>Сохраненное</h1>
        <p>Товары, к которым хочется вернуться.</p>
      </section>
      <div className="product-grid">
        {savedProducts.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
};
