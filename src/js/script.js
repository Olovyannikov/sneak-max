import {rangeslider} from "./components/rangeslider.component";
import {quiz} from "./components/quiz.component";
import accordion from "./components/accordion.component";
import instagram from "./components/insta.component";
import map from "./components/map.component";
import products from "./modules/products";
import 'simplebar/dist/simplebar';
import cart from "./components/cart.component";
import {burger} from "./modules/burger";

window.addEventListener('DOMContentLoaded', () => {
    rangeslider();
    quiz();
    accordion('faq-accordion');
    //instagram();
    map();
    products();
    cart();
    burger();
});

