import GraphModal from "../vendor/modal.vendor";
import Swiper from "swiper";

const products = () => {
    const catalogList = document.querySelector('.catalog-list');
    const catalogMore = document.querySelector('.catalog__more');
    const prodModal = document.querySelector('[data-graph-target="prod-modal"] .modal-content')
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
                                                <button class="product__btn btn-reset"  aria-label="Положить товар в корзину">
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
                    const modal = new GraphModal({
                        isOpen: (modal) => {
                            const openBtnId = modal.previousActiveElement.dataset.id;

                            loadModalData(openBtnId);

                            prodSlider.update();
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
                    //prodModal.innerHTML = '';

                    for (let dataItem of data) {
                        if (dataItem.id == id) {
                            console.log(dataItem)
                        }
                    }
                })
        }

        catalogMore.addEventListener('click', (e) => {
            prodQuantity = prodQuantity + 3;

            loadProducts(prodQuantity);

            if (prodQuantity >= dataLength) {
                catalogMore.style.display = 'none';
            } else {
                catalogMore.style.display = 'block';
            }
        })
    }

}

export default products;
