var dtdapp = undefined;
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
		Dlopen.register('magic-shop', {
			scripts: ["https://cdn.jsdelivr.net/npm/vue@3.2.20/dist/vue.global.js",
				"modules/dtd-shop/dist/dtdShopV3.umd.js"],
			styles: [
				"https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons",
				"modules/dtd-shop/dist/dtdShopV3.css"
			],
			dependencies: [],
			init: () => {
			}
		});

        const observer = new window.MutationObserver(DTDShop._documentModified.bind(DTDShop));
        observer.observe(document, { "subtree": true, "childList": true });
        // this._autoRender();
    }

	static async render(template, element, {data = {}, store = null, dependencies=[], renderData}={}) {
		await Dlopen.loadDependencies(dependencies);	
		return dtdapp;
    }

    static async _autoRender(element) {
        const components = $(element).find(".dtd-app").addBack(".dtd-app");
        for (let el of components.toArray()) {
            const id = el.id || "app";
            const deps = el.getAttribute("dependencies") || undefined;
            // // Can't change the class after render because the element won't exist anymore and there's no guarantee
            // // that the Vue element itself won't be a comment/lazy-loaded.
            // // Also, we don't want to re-trigger the mutation observer on the vue content
            el.classList.remove(".dtd-app");
            el.classList.add(".dtd-app");
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


    static run(message, chatMessageData, options, userID) {
        debugger;
        const match = message.data.content.toLowerCase().match(/dtd-shop/);
        if (match && game.user.isGM) {
            const d = new Dialog({
				title: "Death Trap Dungeons - Shop!",
                content: `<div id="dtdapp" class="dtd-app" dependencies='magic-shop'>
					<div id="app" >Shop Loading, please wait...</div>
					<script src="modules/dtd-shop/dist/dtdShopV3.umd.js"></script>
				</div>`,
                buttons: {}
		}, {height: 840, width: 1300, resizable: false, popOutModuleDisable: true}).render(true);
            // Auto resize after 2 seconds
            setTimeout(() => {			
				d.setPosition();				
			}, 2000);
            return false;
        }        
    }
}
Hooks.on('init', () => DTDShop.init());
Hooks.on('setup', () => DTDShop.setup());
Hooks.on('preCreateChatMessage', (m) => DTDShop.run(m));

CONFIG.debug.hooks = true;