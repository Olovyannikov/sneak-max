import Inputmask from "inputmask";
import './../vendor/just-validate.vendor';

export const validate = () => {
    let styles = getComputedStyle(document.documentElement);
    let colorValue = styles.getPropertyValue('--color-accent');

    let selector = document.querySelector('input[type="tel"]');

    let im = new Inputmask("+7 (999) 999-9999");
    im.mask(selector);

    let productsFormData = null;

    let validateForms = function(selector, rules, messages, successModal, yaGoal) {
        new window.JustValidate(selector, {
            rules: rules,
            messages: messages,
            colorWrong: colorValue,
            submitHandler: function(form) {
                console.log(form);

                let xhr = new XMLHttpRequest();

                if (form.classList.contains('cart-modal__form')) {
                    productsFormData = new FormData(document.querySelector('.cart-modal__form'));

                    document.querySelectorAll('.cart-modal-order__list .mini-cart__item').forEach((el, idx) => {
                        let title = el.querySelector('.mini-product__title').textContent;
                        let price = el.querySelector('.mini-product__price').textContent;
                        productsFormData.append(`product-${idx + 1}`, `${title}, ${price}`);
                    });

                    productsFormData.append(`sum`, `${document.querySelector('.cart-modal-order__sum span').textContent}`);

                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                console.log('Отправлено');
                            }
                        }
                    }

                    xhr.open('POST', 'mail.php', true);
                    xhr.send(productsFormData);

                    form.reset();
                } else {
                    let formData = new FormData(form);

                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                console.log('Отправлено');
                            }
                        }
                    }

                    xhr.open('POST', 'mail.php', true);
                    xhr.send(formData);

                    form.reset();
                }
            }
        });
    }

    validateForms('.callback-form',
        { name: {required: true}, phone: {required: true} },
        { name: {required: 'Вы должны ввести имя'}, phone: {required: 'Вы должны ввести телефон'}},
        '.thanks-popup');

    validateForms('.cart-modal__form',
        { name: {required: true}, phone: {required: true}, email: {required: true, email: true} },
        { name: {required: 'Вы должны ввести имя'}, phone: {required: 'Вы должны ввести телефон'}, email: {required: 'Вы должны ввести email', email: 'Вы должны ввести корректный email'}},
        '.thanks-popup');
}
