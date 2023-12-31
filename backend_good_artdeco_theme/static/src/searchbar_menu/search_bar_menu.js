/** @odoo-module **/

import { Component } from "@odoo/owl";
import { ConfirmationDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
import { Dropdown } from "@web/core/dropdown/dropdown";
import { registry } from "@web/core/registry";
import { sortBy } from "@web/core/utils/arrays";
import { useBus, useService } from "@web/core/utils/hooks";
import { CustomFilterItem } from "@web/search/filter_menu/custom_filter_item";
import { CustomGroupByItem } from "@web/search/group_by_menu/custom_group_by_item";
import { SearchDropdownItem } from "@web/search/search_dropdown_item/search_dropdown_item";
import { FACET_ICONS, GROUPABLE_TYPES } from "@web/search/utils/misc";

const favoriteMenuRegistry = registry.category("favoriteMenu");

export class SearchBarMenu extends Component {
    static template = "backend_good_artdeco_theme.SearchBarMenu";
    static components = {
        Dropdown,
        SearchDropdownItem,
        CustomFilterItem,
        CustomGroupByItem,
    };

    setup() {
        this.facet_icons = FACET_ICONS;
        // GroupBy
        const fields = [];
        for (const [fieldName, field] of Object.entries(this.env.searchModel.searchViewFields)) {
            if (this.validateField(fieldName, field)) {
                fields.push(Object.assign({ name: fieldName }, field));
            }
        }
        this.fields = sortBy(fields, "string");

        // Favorite
        this.dialogService = useService("dialog");

        useBus(this.env.searchModel, "update", this.render);
    }

    ////////////
    // Filter //
    ////////////
    get filterItems() {
        return this.env.searchModel.getSearchItems((searchItem) =>
            ["filter", "dateFilter"].includes(searchItem.type)
        );
    }

    /**
     * @param {Object} param0
     * @param {number} param0.itemId
     * @param {number} [param0.optionId]
     */
    onFilterSelected({ itemId, optionId }) {
        if (optionId) {
            this.env.searchModel.toggleDateFilter(itemId, optionId);
        } else {
            this.env.searchModel.toggleSearchItem(itemId);
        }
    }

    /////////////
    // GroupBy //
    /////////////
    /**
     * @returns {boolean}
     */
    get hideCustomGroupBy() {
        return this.env.searchModel.hideCustomGroupBy || false;
    }

    /**
     * @returns {Object[]}
     */
    get groupByItems() {
        return this.env.searchModel.getSearchItems((searchItem) =>
            ["groupBy", "dateGroupBy"].includes(searchItem.type)
        );
    }

    /**
     * @param {string} fieldName
     * @param {Object} field
     * @returns {boolean}
     */
    validateField(fieldName, field) {
        const { sortable, store, type } = field;
        return (
            (type === "many2many" ? store : sortable) &&
            fieldName !== "id" &&
            GROUPABLE_TYPES.includes(type)
        );
    }

    /**
     * @param {Object} param0
     * @param {number} param0.itemId
     * @param {number} [param0.optionId]
     */
    onGroupBySelected({ itemId, optionId }) {
        if (optionId) {
            this.env.searchModel.toggleDateGroupBy(itemId, optionId);
        } else {
            this.env.searchModel.toggleSearchItem(itemId);
        }
    }

    /**
     * @param {string} fieldName
     */
    onAddCustomGroup(fieldName) {
        this.env.searchModel.createNewGroupBy(fieldName);
    }

    ////////////////
    // Comparison //
    ////////////////

    get showComparisonMenu() {
        for (const key of this.env.searchModel.searchMenuTypes) {
            if (
                key === "comparison" &&
                this.env.searchModel.getSearchItems((i) => i.type === "comparison").length > 0
            ) {
                return true;
            }
        }
        return false;
    }
    get comparisonItems() {
        return this.env.searchModel.getSearchItems(
            (searchItem) => searchItem.type === "comparison"
        );
    }

    /**
     * @param {number} itemId
     */
    onComparisonSelected(itemId) {
        this.env.searchModel.toggleSearchItem(itemId);
    }

    //////////////
    // Favorite //
    //////////////
    /**
     * @returns {Array}
     */
    get favoriteItems() {
        const favorites = this.env.searchModel.getSearchItems(
            (searchItem) => searchItem.type === "favorite"
        );
        const registryMenus = [];
        for (const item of favoriteMenuRegistry.getAll()) {
            if ("isDisplayed" in item ? item.isDisplayed(this.env) : true) {
                registryMenus.push({
                    Component: item.Component,
                    groupNumber: item.groupNumber,
                    key: item.Component.name,
                });
            }
        }
        return [...favorites, ...registryMenus];
    }

    /**
     * @param {number} itemId
     */
    onFavoriteSelected(itemId) {
        this.env.searchModel.toggleSearchItem(itemId);
    }

    /**
     * @param {number} itemId
     */
    openConfirmationDialog(itemId) {
        const { userId } = this.items.find((item) => item.id === itemId);
        const dialogProps = {
            title: this.env._t("Warning"),
            body: userId
                ? this.env._t("Are you sure that you want to remove this filter?")
                : this.env._t(
                        "This filter is global and will be removed for everybody if you continue."
                    ),
            confirm: () => this.env.searchModel.deleteFavorite(itemId),
            cancel: () => {},
        };
        this.dialogService.add(ConfirmationDialog, dialogProps);
    }
}