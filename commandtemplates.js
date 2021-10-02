const randomAPI = 'https://some-random-api.ml/';

class Embed {
	constructor(Discord, IPM) {
		this.Discord = Discord;
		this.IPM = IPM;
	}
	async create(options) {
		const embed = new this.Discord.MessageEmbed(options);
		return embed;
	}
}
module.exports = {
	AnimalPicEmbed: class AnimalPicEmbed extends Embed {
		constructor(discord, IPM) {
			super(discord, IPM);
		}
		async create(animal, caption) {
			const response = await this.IPM.fetch(`${randomAPI}img/${animal}`);
			const animalOptions = {
				title: caption,
				image: {
					url: response.link,
				},
				footer: {
					text: `powered by ${randomAPI}`,
					icon_url: 'https://i.some-random-api.ml/logo.png',
				},
			};
			return await super.create(animalOptions);
		}
	},
	AnimalFactEmbed: class AnimalFactEmbed extends Embed {
		constructor(discord, IPM) {
			super(discord, IPM);
		}
		async create(animal) {
			const fact = await this.IPM.fetch(`${randomAPI}facts/${animal}`);
			const animalOptions = {
				title: fact.fact,
				footer: {
					text: `powered by ${randomAPI}`,
					icon_url: 'https://i.some-random-api.ml/logo.png',
				},
			};
			return await super.create(animalOptions);
		}
	},
};
