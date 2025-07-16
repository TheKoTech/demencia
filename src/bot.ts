import dotenv from 'dotenv'
import { Telegraf } from 'telegraf'
import { adminOnly } from './middleware/admin-only'

dotenv.config()

export default class Bot {
	static instance: Telegraf
	private static initialized = false

	static async init() {
		if (Bot.initialized) throw new Error('Bot must be a singleton')

		if (!process.env.BOT_TOKEN) throw new Error('No token')
		if (!process.env.ADMINS)
			console.warn(
				'ADMINS environment variable not specified. ' +
					'Functionality will be limited.',
			)

		console.log('Initializing bot...')

		Bot.initialized = true

		Bot.instance = new Telegraf(process.env.BOT_TOKEN!)

		Bot.registerCommands()
		Bot.handleErrors()

		// Enable graceful stop
		process.once('SIGINT', () => Bot.instance.stop('SIGINT'))
		process.once('SIGTERM', () => Bot.instance.stop('SIGTERM'))

		return Bot.instance.launch(() => console.log('Bot initialized'))
	}

	private static registerCommands() {
		const bot = Bot.instance

		bot.command('start', async ctx => await ctx.reply('common command'))
		bot.command(
			'update',
			adminOnly,
			async ctx => await ctx.reply('Admin command'),
		)
	}

	private static handleErrors() {
		Bot.instance.catch((error, ctx) => {
			// @ts-expect-error weh
			if (error?.response?.description === 'Bad Request: TOPIC_CLOSED') {
				console.log('Some one tried to @all in a closed topic.')
				return
			}

			return console.error(error, ctx)
		})
	}
}
