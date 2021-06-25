const cart = () => {
    const cartBtn = document.querySelector('.cart__btn');
    const miniCart = document.querySelector('.mini-cart');

    cartBtn.addEventListener('click', () => {
        miniCart.classList.add('mini-cart--visible');
        cartBtn.style.pointerEvents = 'none';

        let div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.left = '0';
        div.style.right = '0';
        div.style.top = '0';
        div.style.bottom = '0';
        div.classList.add('overlay');
        document.body.appendChild(div);
    });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('overlay') || e.target.classList.contains('mini-cart__btn')) {
            miniCart.classList.remove('mini-cart--visible');
            document.querySelector('.overlay').remove();
            cartBtn.style.pointerEvents = 'all';

        }
    });

}

export default cart;
