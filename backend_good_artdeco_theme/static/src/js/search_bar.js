odoo.define('@good_artdeco_theme/js/search_bar', async function(require) {
    'use strict';

    const {patch} = require ("web.utils");
    const {SearchBar} = require("@web/search/search_bar/search_bar");
    const { SearchBarMenu } = require("@backend_good_artdeco_theme/searchbar_menu/search_bar_menu");

    patch(SearchBar, "backend_good_artdeco_theme.SearchBar", {
        components :  {
            SearchBarMenu,
        }
    });

})
