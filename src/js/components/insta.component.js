import {default as InstagramFeed} from 'instafeed';

const instagram = () => {
    const insta = document.querySelector('.instagram__content');
    (function () {
        new InstagramFeed({
            'username': 'max.denaro',
            'display_profile': false,
            'display_gallery': true,
            'display_captions': true,
            'callback': function (data) {
                let instaArray = data.edge_owner_to_timeline_media.edges;

                let newArray = instaArray.slice(0, 5);

                for (let item of newArray) {

                    let element = item.node;
                    insta.insertAdjacentHTML('afterbegin', `
                        <article class="instagram__item">
                            <a href="https://www.instagram.com/${element.shortcode}/" target="_blank">
                                <img src="${element.thumbnail_src}"
                                alt="${element.accessibility_caption}">
                            </a>
                        </article>`
                    )
                }
            },
            'styling': false,
            'items': 5,
            'items_per_row': 5,
            'margin': 1,
            'lazy_load': true,
            'on_error': console.error,
            'host': "https://images" + ~~(Math.random() * 3333) + "-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url=https://www.instagram.com/",
            'cache_time': 660
             })
    })()
}


export default instagram;
