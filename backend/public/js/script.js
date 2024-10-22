document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname === '/') {
        fetch('/api/spots')
            .then(response => response.json())
            .then(cars => {
                const carList = document.getElementById('car-list');
                cars.forEach(car => {
                    const carItem = document.createElement('div');
                    carItem.className = 'car-item';
                    carItem.innerHTML = `
                        <img src="${car.imageUrl}" alt="${car.name}">
                        <h3>${car.name}</h3>
                        <p>Price: $${car.price}/day</p>
                        <a href="/car/${car.id}">View Details</a>
                    `;
                    carList.appendChild(carItem);
                });
            });
    }

    if (window.location.pathname.startsWith('/car/')) {
        const carId = window.location.pathname.split('/').pop();
        fetch(`/api/spots/${carId}`)
            .then(response => response.json())
            .then(car => {
                const carDetails = document.getElementById('car-details');
                carDetails.innerHTML = `
                    <h1>${car.name}</h1>
                    <img src="${car.imageUrl}" alt="${car.name}">
                    <p>Price: $${car.price}/day</p>
                    <p>Location: ${car.location}</p>
                    <p>${car.description}</p>
                `;
            });
    }
});
