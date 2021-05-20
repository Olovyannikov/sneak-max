const accordion = (element) => {
    document.addEventListener('DOMContentLoaded', () => {
        const accordions = document.querySelectorAll(`.${element}`);

        accordions.forEach(el => {
            el.addEventListener('click', (e) => {
                const self = e.currentTarget;
                const control = self.querySelector(`.${element}__control`);
                const content = self.querySelector(`.${element}__content`);

                self.classList.toggle('open');

                // если открыт аккордеон
                if (self.classList.contains('open')) {
                    control.setAttribute('aria-expanded', true);
                    content.setAttribute('aria-hidden', false);
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    control.setAttribute('aria-expanded', false);
                    content.setAttribute('aria-hidden', true);
                    content.style.maxHeight = null;
                }
            });
        });
    });
}

export default accordion;
