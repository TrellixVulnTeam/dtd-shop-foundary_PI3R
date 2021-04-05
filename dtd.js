class DTDShop {
    static init() {
        // Register dependencies for vue-moveable and vue-soundcloud-player
        Dlopen.register('Quasar', {
            scripts: "https://cdn.jsdelivr.net/npm/quasar@1.15.8/dist/quasar.umd.min.js",
            styles: [
                "https://cdn.jsdelivr.net/npm/quasar@1.15.8/dist/quasar.min.css",
				"https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons|Material+Icons+Outlined|Material+Icons+Round",

	        ],
			init: () => {
            	Vue.use(Quasar);
			}
        });

		Dlopen.register('magic-shop', {
			scripts: ["/modules/dtd-shop/dist/dtd-shop-vue.umd.js"],
			styles: [
				"/modules/dtd-shop/dist/dtd-shop-vue.css",
			],
			dependencies: ["Quasar"],
			init: () => {
				console.log("loaded magic-shop");
				Vue.component('App', window['dtd-shop-vue']);
		}
		});

        // Define dependency on our own custom vue components for when we need it
		Dlopen.register('dtd-shop', {
            scripts: "/modules/dtd-shop/dist/vue-components.min.js",
			dependencies: ["magic-shop"]
        });
    }
    static run(message) {
		debugger;
        const match = message.data.content.toLowerCase().match(/dtd/);
        if (match) {
            const d = new Dialog({
				title: "Death Trap Dungeons - Shop!",
                content: `<dtd-shop id="q-app" class="vueport-render" dependencies='dtd-shop'>Loading, please wait...</dtd-shop>`,
                buttons: {}
            }, {height: 'auto', resizable: true, popOutModuleDisable: true}).render(true);
            // Auto resize after 2 seconds
            setTimeout(() => {				
				d.setPosition()
			}, 2000);
        }
    }
}
Hooks.on('init', () => DTDShop.init());
Hooks.on('createChatMessage', (m) => DTDShop.run(m));
