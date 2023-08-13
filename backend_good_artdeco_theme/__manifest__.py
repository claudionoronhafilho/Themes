{
    # Theme information
    'name': "Good Artdeco Backend Theme",
    "description": """Flat design with overlay layout backend theme for Odoo 16""",
    'summary': """The Good Artdeco Theme is a Modern and Stunning Backend Theme
     For Your Odoo V16. This Theme Will Give You A New Experience With Odoo.
      Main Highlight Of The Theme Is The New Side Bar Icon Main Menu with Hover Sub Menus,
       and the Overlay Layout of The Content Panel.
    """,
    "category": "Themes/Backend",
    'version': '16.0.1.0.3',
    'author': 'RMT Works',
    'website': "https://github.com/rmtworks",
    "depends": ['web', 'mail', 'calendar'],
    'assets': {
        'web._assets_primary_variables': {
            '/backend_good_artdeco_theme/static/src/scss/colors.scss',
        },
        'web.assets_backend': {
            '/backend_good_artdeco_theme/static/src/dropdown/dropdown_nav_hook.js',
            '/backend_good_artdeco_theme/static/src/dropdown/dropdown.js',
            '/backend_good_artdeco_theme/static/src/searchbar_menu/search_bar_menu.xml',
            '/backend_good_artdeco_theme/static/src/searchbar_menu/search_bar_menu.js',
            '/backend_good_artdeco_theme/static/src/searchbar_menu/search_bar_menu.scss',
            '/backend_good_artdeco_theme/static/src/xml/search_bar.xml',
            '/backend_good_artdeco_theme/static/src/js/search_bar.js',
            '/backend_good_artdeco_theme/static/src/xml/sidebar.xml',
            '/backend_good_artdeco_theme/static/src/xml/pager.xml',
            '/backend_good_artdeco_theme/static/src/xml/calendar.xml',
            '/backend_good_artdeco_theme/static/src/js/menu_service.js',
            '/backend_good_artdeco_theme/static/src/js/sidebar.js',
            '/backend_good_artdeco_theme/static/src/scss/custom.scss',
            '/backend_good_artdeco_theme/static/src/scss/sidebar.scss',
            '/backend_good_artdeco_theme/static/src/scss/controlpanel.scss',
            '/backend_good_artdeco_theme/static/src/scss/kanban.scss',
            '/backend_good_artdeco_theme/static/src/scss/form.scss',
            '/backend_good_artdeco_theme/static/src/scss/searchview.scss',
            '/backend_good_artdeco_theme/static/src/scss/responsive.scss',
            '/backend_good_artdeco_theme/static/src/scss/fonts.scss',
        }
    },
    'images': [
        'static/description/banner.png',
        'static/description/theme_screenshot.png',
    ],
    'post_init_hook': 'icons_post_init_hook',
    'installable': True,
    'application': False,
    'auto_install': False,
    'license': 'OPL-1',
    'price': 29.99,
    'currency': 'USD'
}
