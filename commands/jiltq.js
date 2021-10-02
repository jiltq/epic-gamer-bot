module.exports = {
	name: 'jiltq',
	description: 'what letter will jiltq\'s username start with now??',
	async execute(message) {
		const newLetter = Math.random().toString(36).replace('0.', '').charAt(0);
		message.member.guild.members.fetch('695662672687005737').then(jiltq =>{
			jiltq.setNickname(`${newLetter}iltq`);
		});
	},
};
