

const CafeDetailsScreen = () => {
  // Sample data extracted from the image
  const restaurant = {
    name: 'Helen Restaurant',
    rating: 4.3,
    reviews: 382,
    avgDeliveryTime: 20,
    description: 'Daihad Awdowid Awidiso Daiwdno Cmasandwai Omdowin Omdowin',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop', // Replace with actual image asset
  };

  const menuItems = [
    { name: 'Beyoaynet', rating: 4.5, price: 120, image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=200&auto=format&fit=crop' },
    { name: 'Soya', rating: 4.5, price: 100, image: 'https://images.unsplash.com/photo-1621646700877-c9179e19e7a7?q=80&w=200&auto=format&fit=crop' },
    { name: 'Beyoaynet', rating: 4.5, price: 120, image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=200&auto=format&fit=crop' },
    { name: 'Ruz Beatakeit', rating: 4.5, price: 100, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=200&auto=format&fit=crop' },
    { name: 'Pasta', rating: 4.5, price: 100, image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=200&auto=format&fit=crop' },
    { name: 'Pasta', rating: 4.5, price: 100, image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=200&auto=format&fit=crop' },
  ];

  return (
    <div className="bg-white min-h-screen text-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <button className="text-gray-500 hover:text-gray-900">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h1 className="text-xl font-bold">Restaurant Detail</h1>
        <button className="text-gray-500 hover:text-gray-900">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5h14v16l-7-7-7 7V5z" /></svg>
        </button>
      </header>

      {/* Hero Image */}
      <div className="px-4 py-5">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-64 object-cover rounded-3xl"
        />
      </div>

      {/* Restaurant Info & Stats */}
      <section className="px-4 mb-6">
        <h2 className="text-2xl font-bold mb-5">{restaurant.name}</h2>
        
        {/* Stats Grid - Matching the visual design with borders */}
        <div className="grid grid-cols-3 gap-0 border border-gray-200 rounded-xl overflow-hidden divide-x divide-gray-200">
          {[
            { value: restaurant.rating, label: 'Rating', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
            { value: restaurant.reviews, label: 'Reviews', icon: 'M8 10h.01M12 10h.01M16 10h.01M21 16a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v10z' },
            { value: `${restaurant.avgDeliveryTime}Min`, label: 'Avg Delivery', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center py-4 px-2">
              <div className="flex items-center space-x-2 mb-1">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} /></svg>
                <span className="text-xl font-semibold text-gray-900">{stat.value}</span>
              </div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Description */}
      <p className="px-4 text-gray-600 mb-8 leading-relaxed">
        {restaurant.description}
      </p>

      {/* Menu Items */}
      <section className="px-4 pb-10">
        <h3 className="text-xl font-semibold mb-6">Menu Items</h3>
        
        {/* Menu Grid - 2 columns */}
        <div className="grid grid-cols-2 gap-6">
          {menuItems.map((item, idx) => (
            <div key={idx} className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm">
              <img
                src={item.image}
                alt={item.name}
                className="w-32 h-24 object-contain rounded-xl mb-4"
              />
              <h4 className="font-semibold text-gray-800 mb-1">{item.name}</h4>
              <div className="flex items-center space-x-1.5 mb-2">
                <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <span className="text-sm text-gray-500 font-medium">{item.rating}</span>
              </div>
              <p className="font-bold text-gray-900 mb-4">{item.price} Birr</p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-full w-full text-sm">
                Add
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CafeDetailsScreen;