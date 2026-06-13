export const getPublicAppUrl = () => {
  const configuredUrl = import.meta.env.VITE_PUBLIC_APP_URL as string | undefined;
  return configuredUrl?.replace(/\/$/, '') || window.location.origin;
};

export const createPublicOrderUrl = (slug: string) => `${getPublicAppUrl()}/order/${slug}`;

export const shareService = {
  async copyLink(url: string) {
    await navigator.clipboard.writeText(url);
  },

  async shareOrder(url: string, title: string) {
    if (navigator.share) {
      await navigator.share({
        title,
        text: 'Заказ в Settle',
        url,
      });
      return true;
    }

    await this.copyLink(url);
    return false;
  },
};
