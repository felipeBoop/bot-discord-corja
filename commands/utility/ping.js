const { SlashCommandBuilder, EmbedBuilder, WebSocketShard } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Veja o ping!'),
	async execute(interaction) {

		const embed = new EmbedBuilder()
			.setColor('000001')
			.setDescription(`**O ping é de:** \`${WebSocketShard.ping} ms\`**.**`);

		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};