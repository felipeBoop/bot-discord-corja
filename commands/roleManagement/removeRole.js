// const froms = ['all', 'human', 'bot']; //Options
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removerole')
		.setDescription('remove uma role de varios membros que serão previamente especificados.')
		.addStringOption(option =>
			option
				.setName('membros')
				.setDescription('Os membros a terem a role retirada, por favor mencione-os.')
				.setRequired(true),
		)
		.addRoleOption(option =>
			option
				.setName('role')
				.setDescription('A role que deseja retirar dos membros especificados.')
				.setRequired(true)),
	async execute(interaction) {
		const role = interaction.options.getRole('role');
		const usersString = interaction.options.getString('membros');

		if (!usersString) {
			await interaction.reply('Nenhum membro fornecido.');
			return;
		}

		const userIds = usersString.match(/\d+/g) || [];

		const successResults = [];
		const errorResults = [];

		for (const userId of userIds) {
			const user = interaction.guild.members.cache.get(userId);

			if (user) {
				try {
					await user.roles.remove(role);
					successResults.push(`✅ ${role.name} removida de **${user.displayName}**`);
				}
				catch (error) {
					console.error(`Erro ao remover a role de ${user.displayName}: ${error.message}`);
					errorResults.push(`❌ Erro ao remover a role de **${user.displayName}**`);
				}
			}
			else {
				console.error(`Membro não encontrado para ID ${userId}`);
				errorResults.push(`❓ Membro não encontrado para ID ${userId}`);
			}
		}

		let replyMessage;
		const embed = new EmbedBuilder();

		if (successResults.length > 0) {
			embed.setColor('008000');
			replyMessage = `**👋 A Role ${role.name} foi removida dos membros!** 👋\n\n **Sucesso:**\n${successResults.join('\n')}\n\n`;
		}
		else {
			embed.setColor('FF0000');
			replyMessage = '**🚫 Houve uma falha ao remover a role!**\n\n';
		}

		if (errorResults.length > 0) {
			replyMessage = replyMessage + `**Erros:**\n${errorResults.join('\n')}\n\n`;
		}

		embed.setDescription(replyMessage);
		await interaction.reply({ embeds: [embed] });
	},
};