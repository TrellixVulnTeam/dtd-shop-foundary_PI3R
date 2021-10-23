class DTDShop {
    static init() {
		game.settings.register("DTDShop", "debug", {
            name: game.i18n.localize("DTDShop.debug"),
            hint: game.i18n.localize("DTDShop.debugHint"),
            scope: "client",
            config: true,
            default: false,
            type: Boolean
        });
    }

	static setup() {
        const debug = game.settings.get("DTDShop", "debug");

        Dlopen.register('vue', {
            scripts: `https://cdn.jsdelivr.net/npm/vue@3.2.20/dist/vue.global.js`,
            init: () => {
				// This is Vue v 2.0 code.
				// See https://v3.vuejs.org/guide/plugins.html#using-a-plugin for how to update it.
                // Vue.config.devtools = debug;              
                // Expose Foundry objects as global object in Vue plugin
                // Vue.use({
                //     install(Vue, options) {
                //         Vue.prototype.ui = ui;
                //         Vue.prototype.game = game;
                //         Vue.prototype.canvas = canvas;
                //     },
                // })
            }
        });
        Dlopen.register('vuex', {
            scripts: `https://unpkg.com/vuex@4.0.0/dist/vuex.global.js`,
            dependencies: "vue",
            init: () => Vue.use(Vuex)
        });

		Dlopen.register('magic-shop', {
			scripts: ["/modules/dtd-shop/dist/dtdShopV3.umd.js"],
			styles: [
				"/modules/dtd-shop/dist/dtdShopV3.css",
				"https://fonts.googleapis.com/icon?family=Material+Icons"
			],
			dependencies: ["vue"],
			init: () => {
				console.log("loaded magic-shop");
			}
		});

        const observer = new window.MutationObserver(DTDShop._documentModified.bind(DTDShop));
        observer.observe(document, { "subtree": true, "childList": true });
        this._autoRender();
    }

	static async render(template, element, {data = {}, store = null, dependencies=[], renderData}={}) {
        const vueDeps = ['vue'];
        if (store) vueDeps.push('vuex');
        await Dlopen.loadDependencies(vueDeps.concat(dependencies));	
		return app;
    }

    static async _autoRender(element) {
        const components = $(element).find(".vueport-render").addBack(".vueport-render");
        for (let el of components.toArray()) {
            const id = el.id || "vueApp";
            const deps = el.getAttribute("dependencies") || undefined;
            // Can't change the class after render because the element won't exist anymore and there's no guarantee
            // that the Vue element itself won't be a comment/lazy-loaded.
            // Also, we don't want to re-trigger the mutation observer on the vue content
            el.classList.remove("vueport-render");
            el.classList.add("vueport-rendered");
            this[id] = await this.render(null, el, {dependencies: deps && deps.split(" ")});
        }
    }
    static async _documentModified(mutations, observer) {
        const addedNodes = mutations.reduce((nodes, mutation) => nodes.concat(...mutation.addedNodes), [])
        return this._autoRender(addedNodes);
    }
    static async loadCss(config) {
        return Dlopen.loadCss(config);
    }


    static run(message) {
        const match = message.data.content.toLowerCase().match(/dtd/);
        if (match) {
            const d = new Dialog({
				title: "Death Trap Dungeons - Shop!",
                content: `<div id="app" class="dtd-app vueport-render" dependencies='magic-shop'>Loading, please wait...</div>`,
                buttons: {}
            }, {height: 925, width: 1500, resizable: false, popOutModuleDisable: true}).render(true);
            // Auto resize after 2 seconds
            setTimeout(() => {				
				d.setPosition()
			}, 2000);
        }
    }
}
Hooks.on('init', () => DTDShop.init());
Hooks.on('setup', () => DTDShop.setup());
Hooks.on('createChatMessage', (m) => DTDShop.run(m));
