module.exports = {
	name: 'guildMemberRemove',
	async execute(member) {
		console.log(`oh no ${member.displayName} left ${member.guild.name} :((`);
	},
};