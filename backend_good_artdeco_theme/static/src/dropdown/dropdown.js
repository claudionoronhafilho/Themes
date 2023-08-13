odoo.define('@good_artdeco_theme/js/dropdown', async function(require) {
    'use strict';

    const {patch} = require ("web.utils");
    const {Dropdown, DROPDOWN} = require("@web/core/dropdown/dropdown");
    const { setupDropdownNavigation } = require("@backend_good_artdeco_theme/dropdown/dropdown_nav_hook");
    const {
        onWillStart,
        useEffect,
        useExternalListener,
        useRef,
        useState,
        useChildSubEnv,
    } = require("@odoo/owl");
    const { useBus, useService } = require( "@web/core/utils/hooks");
    const { usePosition } = require("@web/core/position_hook") ;
    const { localization } = require("@web/core/l10n/localization") ;

    const DIRECTION_CARET_CLASS = {
        bottom: "dropdown",
        top: "dropup",
        left: "dropstart",
        right: "dropend",
    };

    patch(Dropdown.prototype, "backend_good_artdeco_theme.Dropdown", {
        /**
         * @override
         */
        setup() {
            this.state = useState({
                open: this.props.startOpen,
                groupIsOpen: this.props.startOpen,
            });
            this.rootRef = useRef("root");

            // Set up beforeOpen ---------------------------------------------------
            onWillStart(() => {
                if (this.state.open && this.props.beforeOpen) {
                    return this.props.beforeOpen();
                }
            });

            // Set up dynamic open/close behaviours --------------------------------
            if (!this.props.manualOnly) {
                // Close on outside click listener
                useExternalListener(window, "click", this.onWindowClicked, { capture: true });
                // Listen to all dropdowns state changes
                useBus(Dropdown.bus, "state-changed", ({ detail }) =>
                    this.onDropdownStateChanged(detail)
                );
            }

            // Set up UI active element related behavior ---------------------------
            this.ui = useService("ui");
            useEffect(
                () => {
                    Promise.resolve().then(() => {
                        this.myActiveEl = this.ui.activeElement;
                    });
                },
                () => []
            );

            // Set up nested dropdowns ---------------------------------------------
            this.parentDropdown = this.env[DROPDOWN];
            useChildSubEnv({
                [DROPDOWN]: {
                    close: this.close.bind(this),
                    closeAllParents: () => {
                        this.close();
                        if (this.parentDropdown) {
                            this.parentDropdown.closeAllParents();
                        }
                    },
                },
            });

            // Set up key navigation -----------------------------------------------
            setupDropdownNavigation();

            // Set up toggler and positioning --------------------------------------
            /** @type {string} **/
            const position =
                this.props.position || (this.parentDropdown ? "right-start" : "bottom-start");
            let [direction] = position.split("-");
            if (["left", "right"].includes(direction) && localization.direction === "rtl") {
                direction = direction === "left" ? "right" : "left";
            }
            const positioningOptions = {
                popper: "menuRef",
                position,
                onPositioned: (el, { direction, variant }) => {
                    if (this.parentDropdown && ["right", "left"].includes(direction)) {
                        // Correctly align sub dropdowns items with its parent's
                        if (variant === "start") {
                            el.style.marginTop = "calc(-.5rem - 1px)";
                        } else if (variant === "end") {
                            el.style.marginTop = "calc(.5rem - 2px)";
                        }
                    }
                },
            };
            this.directionCaretClass = DIRECTION_CARET_CLASS[direction];
            this.togglerRef = useRef("togglerRef");
            if (this.props.toggler === "parent") {
                // Add parent click listener to handle toggling
                useEffect(
                    () => {
                        const onClick = (ev) => {
                            if (this.rootRef.el.contains(ev.target)) {
                                // ignore clicks inside the dropdown
                                return;
                            }
                            this.toggle();
                        };
                        if (this.rootRef.el.parentElement.tabIndex === -1) {
                            // If the parent is not focusable, make it focusable programmatically.
                            // This code may look weird, but an element with a negative tabIndex is
                            // focusable programmatically ONLY if its tabIndex is explicitly set.
                            this.rootRef.el.parentElement.tabIndex = -1;
                        }
                        this.rootRef.el.parentElement.addEventListener("click", onClick);
                        return () => {
                            this.rootRef.el.parentElement.removeEventListener("click", onClick);
                        };
                    },
                    () => []
                );

                useEffect(
                    (open) => {
                        this.rootRef.el.parentElement.ariaExpanded = open ? "true" : "false";
                    },
                    () => [this.state.open]
                );

                // Position menu relatively to parent element
                usePosition(() => this.rootRef.el.parentElement, positioningOptions);
            } else {
                // Position menu relatively to inner toggler
                const togglerRef = useRef("togglerRef");
                usePosition(() => togglerRef.el, positioningOptions);
            }
        }
    });

})
