const btnSeemore = document.querySelector('.see__more')
const wrapperEl = document.querySelector('.wrapper')
const BASE_URL = 'https://dummyjson.com'
const searchInputEl = document.querySelector(
	".input__form input[type='search']"
)
const searchDropEl = document.querySelector('.drop__down')

const perPageCount = 8
let offset = 0
let productEndpoint = '/products'

async function fetchData(endpoint) {
	try {
		const response = await fetch(`${BASE_URL}${endpoint}`)
		const res = await response.json()

		createCard(res)

		if (res.total <= perPageCount + offset * perPageCount) {
			btnSeemore.style.display = 'none'
		} else {
			btnSeemore.style.display = 'block'
		}
	} catch (err) {
		console.log('Error fetching data:', err)
	} finally {
		btnSeemore.removeAttribute('disabled')
		btnSeemore.textContent = 'See more'
	}
}

function createCard(data) {
	data.products.forEach(product => {
		const divEl = document.createElement('div')
		divEl.className = 'card'
		divEl.innerHTML = `
            <img data-id=${product.id} src="${product.thumbnail}" alt="Product image">
            <div class="card__content">
                <span>${product.title}</span>
                <strong>${product.price} USD</strong>
							
            </div>
        `
		wrapperEl.appendChild(divEl)
	})
}

window.addEventListener('load', () => {
	fetchData(`${productEndpoint}?limit=${perPageCount}`)
})

btnSeemore.addEventListener('click', () => {
	btnSeemore.setAttribute('disabled', true)
	btnSeemore.textContent = 'Loading...'
	offset++
	fetchData(
		`${productEndpoint}?limit=${perPageCount}&skip=${offset * perPageCount}`
	)
})

wrapperEl.addEventListener('click', e => {
	if (e.target.tagName === 'IMG') {
		const productId = e.target.dataset.id
		if (productId) {
			open(`./pages/page.html?id=${productId}`)
		}
	}
})

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
