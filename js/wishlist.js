document.addEventListener('DOMContentLoaded', () => {
	const wishlistWrapper = document.querySelector('.wishlist-wrapper')

	const favorites = JSON.parse(localStorage.getItem('wishlist')) || []

	if (favorites.length === 0) {
		wishlistWrapper.innerHTML = `<p class="no-items">Your wishlist is empty.</p>`
	} else {
		favorites.forEach(item => {
			const divEl = document.createElement('div')
			divEl.className = 'detail__wrapper'
			divEl.innerHTML = `
				<div class="detail__image">
					<img src="${item.thumbnail}" alt="${item.title}">
					<p>All hand-made with natural soy wax, Candleaf is made for your pleasure moments.</p>
					<span>🚚 FREE SHIPPING</span>
				</div>
				<div class="detail__content">
					<h4>${item.title}</h4>
					<div class="btn__price">
						<strong>${item.price}</strong>
						<button>Add to cart</button>
					</div>
					<div class="quantity">
						<span>Quantity</span>
						<div>
							<button>+ 1 -</button>
						</div>
					</div>
					<button class="remove-favorite" data-id="${item.id}">Remove</button>
				</div>
			`
			wishlistWrapper.appendChild(divEl)
		})
	}

	wishlistWrapper.addEventListener('click', e => {
		if (e.target.classList.contains('remove-favorite')) {
			const id = e.target.dataset.id
			const updatedFavorites = favorites.filter(item => item.id !== id)
			localStorage.setItem('wishlist', JSON.stringify(updatedFavorites))
			e.target.closest('.detail__wrapper').remove()
		}
	})
})
