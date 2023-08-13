odoo.define('@good_artdeco_theme/js/menu_service', async function(require) {
    'use strict';
    let __exports = {};
    const {browser} = require("@web/core/browser/browser");
    const {registry} = require("@web/core/registry");
    const {session} = require("@web/session");
    const loadMenusUrl = `/web/webclient/load_menus`;
    const menuServiceRegistry = registry.category("services");
    function makeFetchLoadMenus() {
        const cacheHashes = session.cache_hashes;
        let loadMenusHash = cacheHashes.load_menus || new Date().getTime().toString();
        return async function fetchLoadMenus(reload) {
            if (reload) {
                loadMenusHash = new Date().getTime().toString();
            } else if (odoo.loadMenusPromise) {
                return odoo.loadMenusPromise;
            }
            const res = await browser.fetch(`${loadMenusUrl}/${loadMenusHash}`);
            if (!res.ok) {
                throw new Error("Error while fetching menus");
            }
            return res.json();
        };
    }
    function createMenus(env, menusData, fetchLoadMenus) {
        let currentAppId;
        return {
            getAll() {
                return Object.values(menusData);
            },
            getApps() {
                return this.getMenu("root").children.map((mid) => this.getMenu(mid));
            },
            getCurrentApp() {
                if (!currentAppId) {
                    return;
                }
                return this.getMenu(currentAppId);
            },
            getMenu(menuID) {
                return menusData[menuID];
            },
            getMenuAsTree(menuID) {
                const menu = this.getMenu(menuID);
                if (!menu.childrenTree) {
                    menu.childrenTree = menu.children.map((mid) => this.getMenuAsTree(mid));
                }
                return menu;
            },
            async selectMenu(menu) {
                menu = typeof menu === "number" ? this.getMenu(menu) : menu;
                if (!menu.actionID) {
                    return;
                }
                await env.services.action.doAction(menu.actionID, {
                    clearBreadcrumbs: true
                });
                this.setCurrentMenu(menu);
            },
            setCurrentMenu(menu) {
                menu = typeof menu === "number" ? this.getMenu(menu) : menu;
                if (menu && menu.appID !== currentAppId) {
                    currentAppId = menu.appID;
                    env.bus.trigger("MENUS:APP-CHANGED");
                    env.services.router.pushState({
                        menu_id: menu.id
                    }, {
                        lock: true
                    });
                }
            },
            async reload() {
                if (fetchLoadMenus) {
                    menusData = await fetchLoadMenus(true);
                    env.bus.trigger("MENUS:APP-CHANGED");
                }
            },
        };
    }
    const menuService = __exports.menuService = {
        dependencies: ["action", "router"],
        async start(env) {
            const fetchLoadMenus = makeFetchLoadMenus();
            const menusData = await fetchLoadMenus();
            return createMenus(env, menusData, fetchLoadMenus);
        },
    };
    menuServiceRegistry.remove("menu");
    menuServiceRegistry.add("menu", menuService);
    return __exports;
});