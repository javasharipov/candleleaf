const detailWrapperEl = document.querySelector('.detail__wrapper')
const BASE_URL = 'https://dummyjson.com'
const searchInputEl = document.querySelector(
	".input__form input[type='search']"
)
const searchDropEl = document.querySelector('.drop__down')

async function fetchData() {
	let params = new URLSearchParams(window.location.search)
	const response = await fetch(`${BASE_URL}/products/${params.get('id')}`)
	response
		.json()
		.then(res => {
			createDetailPage(res)
		})
		.catch(err => console.error('Error fetching product details:', err))
}

function createDetailPage(data) {
	detailWrapperEl.innerHTML = `
        <div class="detail__image">
            <img src="${data.images[0]}" alt="${data.title}">
            <p>${data.description}</p>
            <span>\uD83D\uDE9A FREE SHIPPING</span>
        </div>
        <div class="detail__content">
            <h4>${data.title}</h4>
            <div class="btn__price">
                <strong>$${data.price}</strong>
                <button>Add to cart</button>
            </div>
            <div class="quantity">
                <span>Quantity</span>
                <div>
                    <button>-</button>
                    <span>1</span>
                    <button>+</button>
                </div>
            </div>
        </div>
    `
}

window.onload = () => {
	fetchData()
}
searchInputEl.addEventListener('keyup', async e => {
	const value = e.target.value.trim()
	if (value) {
		searchDropEl.style.display = 'block'
		try {
			const response = await fetch(
				`${BASE_URL}/products/search?q=${value}&limit=5`
			)
			const res = await response.json()

			searchDropEl.innerHTML = ''
			if (res.products.length === 0) {
				searchDropEl.innerHTML = `<p class="no-results">No results found</p>`
			} else {
				res.products.forEach(item => {
					const divEl = document.createElement('div')
					divEl.className = 'search__item'
					divEl.dataset.id = item.id
					divEl.innerHTML = `
                        <img src="${item.thumbnail}" alt="${item.title}">
                        <div>
                            <p>${item.title}</p>
                        </div>
                    `
					searchDropEl.appendChild(divEl)
				})
			}
		} catch (err) {
			console.error('Error fetching search results:', err)
		}
	} else {
		searchDropEl.style.display = 'none'
	}
})

searchDropEl.addEventListener('click', e => {
	const searchItem = e.target.closest('.search__item')
	if (searchItem) {
		const id = searchItem.dataset.id
		window.location.href = `/pages/page.html?id=${id}`
		searchInputEl.value = ''
		searchDropEl.style.display = 'none'
	}
})
