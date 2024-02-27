// const froms = ['all', 'human', 'bot']; //Options
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addrole')
		.setDescription('adiciona uma role a varios membros que serão previamente especificados.')
		.addStringOption(option =>
			option
				.setName('membros')
				.setDescription('Os membros a terem a role adicionada, por favor mencione-os.')
				.setRequired(true),
		)
		.addRoleOption(option =>
			option
				.setName('role')
				.setDescription('A role que deseja dar aos membros especificados.')
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
					await user.roles.add(role);
					successResults.push(`✅ ${role.name} adicionada a **${user.displayName}**`);
				}
				catch (error) {
					console.error(`Erro ao adicionar a role a ${user.displayName}: ${error.message}`);
					errorResults.push(`❌ Erro ao adicionar a role a **${user.displayName}**`);
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
			replyMessage = `**⚡ A Role ${role.name} foi adicionada aos membros!** ⚡\n\n **Sucesso:**\n${successResults.join('\n')}\n\n`;
		}
		else {
			embed.setColor('FF0000');
			replyMessage = '**🚫 Houve uma falha ao adicionar a role!**\n\n';
		}

		if (errorResults.length > 0) {
			replyMessage = replyMessage + `**Erros:**\n${errorResults.join('\n')}\n\n`;
		}

		embed.setDescription(replyMessage);
		await interaction.reply({ embeds: [embed] });
	},
};