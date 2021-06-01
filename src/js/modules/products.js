import GraphModal from "../vendor/modal.vendor";
import Swiper from "swiper";

const products = () => {
    const catalogList = document.querySelector('.catalog-list');
    const catalogMore = document.querySelector('.catalog__more');
    const prodModal = document.querySelector('[data-graph-target="prod-modal"] .modal-content')
    const prodModalSlider = prodModal.querySelector('.modal-slider .swiper-wrapper');
    const prodModalPreview = prodModal.querySelector('.modal-slider .modal-preview');
    const prodModalInfo = prodModal.querySelector('.modal-info__wrapper');
    const prodModalDescr = prodModal.querySelector('.modal-prod-descr');
    const prodChars = prodModal.querySelector('.prod-chars');
    const prodModalVideo = prodModal.querySelector('.prod-modal__video');
    let prodQuantity = 5;
    let dataLength = null;

    const normalPrice = str => {
        return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
    }

    const prodSlider = new Swiper('.modal-slider__container', {
        slidesPerView: 1,
        spaceBetween: 20
    })

    if (catalogList) {
        const loadProducts = (quantity = 5) => {
            fetch('../assets/data/data.json')
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    dataLength = data.length;

                    catalogList.innerHTML = '';

                    for (let i = 0; i < dataLength; i++) {
                        if (i < quantity) {
                            let item = data[i];

                            catalogList.innerHTML += `
                                <li class="catalog-list__item">
                                    <article class="product">
                                        <div class="product__image"><img src="assets/${item.mainImage}" alt="${item.title}"/>
                                            <div class="product__buttons">
                                                <button class="product__btn btn-reset" data-graph-path="prod-modal" data-id="${item.id}" aria-label="Показать информацию о товаре">
                                                    <svg>
                                                        <use href="img/sprite.svg#show"></use>
                                                    </svg>
                                                </button>
                                                <button class="product__btn js-cart btn-reset" data-id="${item.id}"  aria-label="Положить товар в корзину">
                                                    <svg>
                                                        <use href="img/sprite.svg#cart"></use>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <h3 class="product__title">${item.title}</h3>
                                        <span class="product__price">${normalPrice(item.price)} р</span>
                                    </article>
                                </li>
                            `;
                        }
                    }
                })
                .then(() => {

                    cartLogic();

                    const modal = new GraphModal({
                        isOpen: (modal) => {

                            if (modal.modalContainer.classList.contains('prod-modal')) {
                                const openBtnId = modal.previousActiveElement.dataset.id;

                                loadModalData(openBtnId);

                                prodSlider.update();
                            }
                        }
                    });
                })
        }

        loadProducts(prodQuantity);

        const loadModalData = (id = 1) => {
            fetch('../assets/data/data.json')
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    prodModalSlider.innerHTML = '';
                    prodModalPreview.innerHTML = '';
                    prodModalInfo.innerHTML = '';
                    prodModalDescr.textContent = '';
                    prodChars.innerHTML = '';
                    prodModalVideo.innerHTML = '';

                    for (let dataItem of data) {
                        if (dataItem.id == id) {
                            const slides = dataItem.gallery.map((image, idx) => {
                                return `
                                    <div class="swiper-slide" data-index="${idx}">
                                        <img src="${image}" alt="">
                                    </div>
                                `
                            });

                            const preview = dataItem.gallery.map((image, index) => {
                                return `
                                <div class="modal-preview__item ${index === 0 ? 'modal-preview__item--active' : ''}" tabindex="0" data-index="${index}">
                                    <img src="${image}" alt="">
                                </div>
                                `;
                            });

                            const sizes = dataItem.sizes.map((size) => {
                                return `
                                <li class="modal-sizes__item">
                                    <button class="modal-sizes__btn btn-reset">${size}</button>
                                </li>
                                `
                            });

                            prodModalSlider.innerHTML = slides.join(' ');
                            prodModalPreview.innerHTML = preview.join(' ');
                            prodModalInfo.innerHTML = `
                                    <h3 class="modal-info__title">${dataItem.title}</h3>
                                    <div class="modal-info__rate">
                                        <img src="img/star.svg" alt="Рейтинг 5 из 5" />
                                        <img src="img/star.svg" alt="" />
                                        <img src="img/star.svg" alt="" />
                                        <img src="img/star.svg" alt="" />
                                        <img src="img/star.svg" alt="" />
                                    </div>
                                    <div class="modal-info__sizes">
                                        <span class="modal-info__subtitle">Выберите размер</span>
                                        <ul class="list-reset modal-info__sizes-list modal-sizes">
                                            ${sizes.join(' ')}
                                        </ul>
                                    </div>
                                    <div class="modal-info__price">
                                        <span class="modal-info__current-price">${dataItem.price}</span>
                                        <span class="modal-info__old-price">${dataItem.oldPrice + 'p' ? dataItem.oldPrice : ''}</span>
                                    </div>

                            `;

                            prodModalDescr.textContent = dataItem.description;

                            let charsItems = ``;

                            Object.keys(dataItem.chars).forEach(function eachKey(key) {
                                charsItems += `<p class="prod-bottom__descr prod-chars__item">${key}: ${dataItem.chars[key]}</p>`
                            })

                            prodChars.innerHTML = charsItems;

                            if (dataItem.video) {
                                prodModalVideo.style.display = 'block';
                                prodModalVideo.innerHTML = `
                            <iframe src="${dataItem.video}"
                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                             allowfullscreen></iframe>
                            `;
                            } else {
                                prodModalVideo.style.display = 'none'
                            }

                        }
                    }
                })
                .then(() => {
                    prodSlider.update();

                    prodSlider.on('slideChangeTransitionEnd', () => {
                        let idx = document.querySelector('.swiper-slide-active').dataset.index;
                        document.querySelectorAll('.modal-preview__item').forEach(el => {
                            el.classList.remove('modal-preview__item--active')
                        })
                        document.querySelector(`.modal-preview__item[data-index="${idx}"]`).classList.add('modal-preview__item--active');
                    })

                    document.querySelectorAll('.modal-preview__item').forEach(el => {
                        el.addEventListener('click', (e) => {
                            const idx = +e.currentTarget.dataset.index;
                            document.querySelectorAll('.modal-preview__item').forEach(el => {
                                el.classList.remove('modal-preview__item--active')
                            })
                            e.currentTarget.classList.add('modal-preview__item--active')
                            prodSlider.slideTo(idx)
                        })
                    })
                })
        }

        catalogMore.addEventListener('click', () => {
            prodQuantity = prodQuantity + 3;

            loadProducts(prodQuantity);

            if (prodQuantity >= dataLength) {
                catalogMore.style.display = 'none';
            } else {
                catalogMore.style.display = 'block';
            }
        })
    }

    /* Cart */
    let price = 0;
    const miniCartList = document.querySelector('.mini-cart__list');
    const fullPrice = document.querySelector('.mini-cart__sum');
    const cartCount = document.querySelector('.cart__count');

    const priceWithoutSpaces = str => str.replace(/\s/g, '');
    const plusFullPrice = currentPrice => price += currentPrice;
    const minusFullPrice = currentPrice => price -= currentPrice;
    const printFullPrice = () => fullPrice.textContent = `${normalPrice(price)} р`;
    const printQuantity = (num) => cartCount.textContent = num;

    const loadCartData = (id = 1) => {
        fetch('../assets/data/data.json')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                for (let dataItem of data) {
                    if (dataItem.id == id) {
                        miniCartList.insertAdjacentHTML('afterbegin', `
                            <li class="mini-cart__item" data-id="${dataItem.id}">
                                <article class="mini-cart__product mini-product">
                                    <div class="mini-product__image"><img src="assets/${dataItem.mainImage}" alt="${dataItem.title}" /></div>
                                    <div class="mini-product__content">
                                        <div class="mini-product__text">
                                            <h3 class="mini-product__title">${dataItem.title}</h3>
                                            <span class="mini-product__price">${normalPrice(dataItem.price)} р</span>
                                        </div>
                                        <button class="btn-reset mini-product__delete" aria-label="Удалить товар">
                                            <svg>
                                                <use href="img/sprite.svg#trash"></use>
                                            </svg>
                                        </button>
                                    </div>
                                </article>
                            </li>
                        `);

                        return dataItem
                    }
                }
            })
            .then((item) => {
                plusFullPrice(item.price);
                printFullPrice();
                let num = document.querySelectorAll('.mini-cart__item').length;
                cartCount.classList.add(num > 0 ? 'cart__count--visible' : '');
                printQuantity(num);
            })
    }

    const cartLogic = () => {
        const productBtn = document.querySelectorAll('.product__btn');
        productBtn.forEach(el => {
            el.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                loadCartData(id);
                e.currentTarget.classList.add('product__btn--disabled')
            })
        })

        miniCartList.addEventListener('click', (e) => {
            if (e.target.classList.contains('mini-product__delete')) {

                const self = e.target;
                const parent = self.closest('.mini-cart__item');
                let price = parseInt(priceWithoutSpaces(parent.querySelector('.mini-product__price').textContent));
                const id = parent.dataset.id;

                document.querySelector(`.js-cart[data-id="${id}"]`).classList.remove('product__btn--disabled')
                parent.remove();

                minusFullPrice(price);
                printFullPrice();

                let num = document.querySelectorAll('.mini-cart__item').length;
                cartCount.textContent = num.toString();
                cartCount.classList.remove(num === 0 ? 'cart__count--visible' : '');
                printQuantity(num);
            }
        })
    }
}

export default products;
